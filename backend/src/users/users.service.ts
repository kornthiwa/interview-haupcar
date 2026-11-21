import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { PublicUser, User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(({ password: _, ...user }) => user);
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password: _, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    const current = await this.passwords.verify(dto.password, user?.password);

    let legacy = false;
    if (!current && user) {
      const [salt, storedHash] = user.password.split(':');
      if (salt && storedHash) {
        const hash = (await promisify(scrypt)(dto.password, salt, 64)) as Buffer;
        const storedBuffer = Buffer.from(storedHash, 'hex');
        legacy =
          storedBuffer.length === hash.length &&
          timingSafeEqual(hash, storedBuffer);
      }
    }

    if (!user || (!current && !legacy)) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (legacy) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: await this.passwords.hash(dto.password) },
      });
    }

    const tokens = await this.tokens.issue(user.id, {
      claims: { name: user.name },
    });
    const { password: _, ...result } = user;
    return {
      ...result,
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    };
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          username: dto.username,
          password: await this.passwords.hash(dto.password),
        },
      });
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async logout(accessToken: string) {
    try {
      await this.tokens.revoke(accessToken);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicUser> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          username: dto.username,
          password: dto.password
            ? await this.passwords.hash(dto.password)
            : undefined,
        },
      });
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}

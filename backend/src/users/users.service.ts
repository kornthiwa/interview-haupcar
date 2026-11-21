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
import { CreateUserDto, LoginDto, UpdateUserDto } from './dto/user.dto.js';

const scryptAsync = promisify(scrypt);

const userSelect = {
  id: true,
  name: true,
  username: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserRecord = {
  id: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

async function verifyLegacyPassword(password: string, stored: string) {
  const [salt, storedHash] = stored.split(':');
  if (!salt || !storedHash) return false;

  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (storedBuffer.length !== hash.length) return false;
  return timingSafeEqual(hash, storedBuffer);
}

function isPrismaError(
  error: unknown,
  code: string,
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError && error.code === code;
}

function isUniqueConflict(error: unknown) {
  return isPrismaError(error, 'P2002');
}

function isMissing(error: unknown) {
  return isPrismaError(error, 'P2025');
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    const current = await this.passwords.verify(dto.password, user?.password);
    const legacy =
      !current && user
        ? await verifyLegacyPassword(dto.password, user.password)
        : false;
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
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    };
  }

  async create(dto: CreateUserDto): Promise<UserRecord> {
    try {
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          username: dto.username,
          password: await this.passwords.hash(dto.password),
        },
        select: userSelect,
      });
    } catch (error) {
      if (isUniqueConflict(error)) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async logout(accessToken: string) {
    try {
      await this.tokens.revoke(accessToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserRecord> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          username: dto.username,
          password: dto.password
            ? await this.passwords.hash(dto.password)
            : undefined,
        },
        select: userSelect,
      });
    } catch (error) {
      if (isMissing(error)) throw new NotFoundException('User not found');
      if (isUniqueConflict(error)) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (isMissing(error)) throw new NotFoundException('User not found');
      throw error;
    }
  }
}

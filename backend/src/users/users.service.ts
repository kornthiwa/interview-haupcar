import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
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

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString('hex')}`;
}

async function verifyPassword(password: string, stored: string) {
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
  constructor(private readonly prisma: PrismaService) {}

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

  async login(dto: LoginDto): Promise<UserRecord> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    const matches = user
      ? await verifyPassword(dto.password, user.password)
      : false;
    if (!user || !matches) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(dto: CreateUserDto): Promise<UserRecord> {
    try {
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          username: dto.username,
          password: await hashPassword(dto.password),
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

  async update(id: string, dto: UpdateUserDto): Promise<UserRecord> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          username: dto.username,
          password: dto.password ? await hashPassword(dto.password) : undefined,
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

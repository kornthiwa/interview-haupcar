import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarTypeDto } from './dto/create-car-type.dto.js';
import { UpdateCarTypeDto } from './dto/update-car-type.dto.js';
import type { CarType } from './entities/car-type.entity.js';

@Injectable()
export class CarTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCarTypeDto): Promise<CarType> {
    try {
      return await this.prisma.carType.create({
        data: { name: dto.name },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Car type already exists');
      }
      throw error;
    }
  }

  findAll(): Promise<CarType[]> {
    return this.prisma.carType.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string): Promise<CarType> {
    const carType = await this.prisma.carType.findUnique({ where: { id } });
    if (!carType) throw new NotFoundException('Car type not found');
    return carType;
  }

  async update(id: string, dto: UpdateCarTypeDto): Promise<CarType> {
    try {
      return await this.prisma.carType.update({
        where: { id },
        data: { name: dto.name },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Car type not found');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Car type already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.carType.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Car type not found');
      }
      throw error;
    }
  }
}

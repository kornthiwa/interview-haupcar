import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Paginated } from '../common/dto/pagination-query.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarTypeDto } from './dto/create-car-type.dto.js';
import { ListCarTypesDto } from './dto/list-car-types.dto.js';
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

  async findAll(query: ListCarTypesDto): Promise<Paginated<CarType>> {
    const term = query.searchTerm;
    const where = term
      ? { name: { contains: term, mode: 'insensitive' as const } }
      : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.carType.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: query.skip,
        take: query.take,
      }),
      this.prisma.carType.count({ where }),
    ]);

    return query.toResult(data, total);
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

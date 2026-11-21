import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarDto } from './dto/create-car.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';
import type { Car } from './entities/car.entity.js';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCarDto): Promise<Car> {
    try {
      return await this.prisma.car.create({
        data: {
          licensePlate: dto.licensePlate,
          color: dto.color,
          pricePerDay: dto.pricePerDay,
          status: dto.status,
          rentalDate: dto.rentalDate ? new Date(dto.rentalDate) : undefined,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          typeId: dto.typeId,
          carModelId: dto.carModelId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('License plate already exists');
      }
      throw error;
    }
  }

  findAll(): Promise<Car[]> {
    return this.prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async update(id: string, dto: UpdateCarDto): Promise<Car> {
    try {
      return await this.prisma.car.update({
        where: { id },
        data: {
          licensePlate: dto.licensePlate,
          color: dto.color,
          pricePerDay: dto.pricePerDay,
          status: dto.status,
          rentalDate:
            dto.rentalDate === undefined
              ? undefined
              : new Date(dto.rentalDate),
          dueDate:
            dto.dueDate === undefined ? undefined : new Date(dto.dueDate),
          typeId: dto.typeId,
          carModelId: dto.carModelId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Car not found');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('License plate already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.car.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Car not found');
      }
      throw error;
    }
  }
}

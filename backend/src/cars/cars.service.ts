import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CarStatus, type Prisma } from '@prisma/client';
import type { Paginated } from '../common/dto/pagination-query.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarDto } from './dto/create-car.dto.js';
import { ListCarsDto } from './dto/list-cars.dto.js';
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
          notes: dto.notes,
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

  async findAll(query: ListCarsDto): Promise<Paginated<Car>> {
    const term = query.searchTerm;
    const status = term
      ? Object.values(CarStatus).find((value) => value === term.toLowerCase())
      : undefined;

    let where: Prisma.CarWhereInput | undefined;
    if (term) {
      const or: Prisma.CarWhereInput[] = [
        { licensePlate: { contains: term, mode: 'insensitive' } },
        { color: { contains: term, mode: 'insensitive' } },
        { notes: { contains: term, mode: 'insensitive' } },
      ];
      if (status) or.push({ status });
      where = { OR: or };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.car.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.take,
      }),
      this.prisma.car.count({ where }),
    ]);

    return query.toResult(data, total);
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
          notes: dto.notes,
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

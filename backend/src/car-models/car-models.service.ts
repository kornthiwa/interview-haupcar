import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarModelDto } from './dto/create-car-model.dto.js';
import { UpdateCarModelDto } from './dto/update-car-model.dto.js';
import type { CarModel } from './entities/car-model.entity.js';

@Injectable()
export class CarModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCarModelDto): Promise<CarModel> {
    try {
      return await this.prisma.carModel.create({
        data: {
          name: dto.name,
          brandId: dto.brandId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Car model already exists');
      }
      throw error;
    }
  }

  findAll(): Promise<CarModel[]> {
    return this.prisma.carModel.findMany({
      orderBy: [{ brandId: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string): Promise<CarModel> {
    const carModel = await this.prisma.carModel.findUnique({ where: { id } });
    if (!carModel) throw new NotFoundException('Car model not found');
    return carModel;
  }

  async update(id: string, dto: UpdateCarModelDto): Promise<CarModel> {
    try {
      return await this.prisma.carModel.update({
        where: { id },
        data: {
          name: dto.name,
          brandId: dto.brandId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Car model not found');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Car model already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.carModel.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Car model not found');
      }
      throw error;
    }
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Paginated } from '../common/dto/pagination-query.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';
import { ListBrandsDto } from './dto/list-brands.dto.js';
import { UpdateBrandDto } from './dto/update-brand.dto.js';
import type { Brand } from './entities/brand.entity.js';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBrandDto): Promise<Brand> {
    try {
      return await this.prisma.brand.create({
        data: { name: dto.name },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Brand already exists');
      }
      throw error;
    }
  }

  async findAll(query: ListBrandsDto): Promise<Paginated<Brand>> {
    const term = query.searchTerm;
    const where = term
      ? { name: { contains: term, mode: 'insensitive' as const } }
      : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.brand.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: query.skip,
        take: query.take,
      }),
      this.prisma.brand.count({ where }),
    ]);

    return query.toResult(data, total);
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto): Promise<Brand> {
    try {
      return await this.prisma.brand.update({
        where: { id },
        data: { name: dto.name },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Brand not found');
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Brand already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.brand.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Brand not found');
      }
      throw error;
    }
  }
}

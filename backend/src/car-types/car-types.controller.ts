import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarTypesService } from './car-types.service.js';
import { CreateCarTypeDto } from './dto/create-car-type.dto.js';
import { UpdateCarTypeDto } from './dto/update-car-type.dto.js';

@Controller('car-types')
export class CarTypesController {
  constructor(private readonly carTypesService: CarTypesService) {}

  @Post()
  create(@Body() dto: CreateCarTypeDto) {
    return this.carTypesService.create(dto);
  }

  @Get()
  findAll() {
    return this.carTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCarTypeDto,
  ) {
    return this.carTypesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.carTypesService.remove(id);
  }
}

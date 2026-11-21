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
import { CarModelsService } from './car-models.service.js';
import { CreateCarModelDto } from './dto/create-car-model.dto.js';
import { UpdateCarModelDto } from './dto/update-car-model.dto.js';

@Controller('car-models')
export class CarModelsController {
  constructor(private readonly carModelsService: CarModelsService) {}

  @Post()
  create(@Body() dto: CreateCarModelDto) {
    return this.carModelsService.create(dto);
  }

  @Get()
  findAll() {
    return this.carModelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carModelsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCarModelDto,
  ) {
    return this.carModelsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.carModelsService.remove(id);
  }
}

import { Module } from '@nestjs/common';
import { CarTypesService } from './car-types.service.js';
import { CarTypesController } from './car-types.controller.js';

@Module({
  controllers: [CarTypesController],
  providers: [CarTypesService],
})
export class CarTypesModule {}

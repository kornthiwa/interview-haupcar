import { Module } from '@nestjs/common';
import { CarModelsService } from './car-models.service.js';
import { CarModelsController } from './car-models.controller.js';

@Module({
  controllers: [CarModelsController],
  providers: [CarModelsService],
})
export class CarModelsModule {}

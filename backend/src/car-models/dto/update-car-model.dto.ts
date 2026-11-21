import { PartialType } from '@nestjs/mapped-types';
import { CreateCarModelDto } from './create-car-model.dto.js';

export class UpdateCarModelDto extends PartialType(CreateCarModelDto) {}

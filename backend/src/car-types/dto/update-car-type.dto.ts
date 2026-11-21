import { PartialType } from '@nestjs/mapped-types';
import { CreateCarTypeDto } from './create-car-type.dto.js';

export class UpdateCarTypeDto extends PartialType(CreateCarTypeDto) {}

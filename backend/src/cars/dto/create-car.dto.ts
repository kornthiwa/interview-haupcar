import { CarStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsInt()
  @IsPositive()
  pricePerDay: number;

  @IsOptional()
  @IsEnum(CarStatus)
  status?: CarStatus;

  @IsOptional()
  @IsDateString()
  rentalDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsUUID()
  typeId: string;

  @IsUUID()
  carModelId: string;
}

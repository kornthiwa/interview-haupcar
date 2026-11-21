import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCarModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  brandId: string;
}

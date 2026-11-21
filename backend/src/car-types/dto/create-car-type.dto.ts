import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SaveUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

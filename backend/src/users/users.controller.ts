import { Body, Controller, Get, Put } from '@nestjs/common';
import { SaveUserDto } from './dto/save-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getProfile() {
    return this.usersService.getProfile();
  }

  @Put()
  save(@Body() dto: SaveUserDto) {
    return this.usersService.save(dto);
  }
}

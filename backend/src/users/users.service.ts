import { Injectable } from '@nestjs/common';
import { SaveUserDto } from './dto/save-user.dto.js';

export type UserProfile = SaveUserDto;

@Injectable()
export class UsersService {
  private profile: UserProfile | null = null;

  getProfile(): UserProfile | null {
    return this.profile;
  }

  save(dto: SaveUserDto): UserProfile {
    this.profile = { name: dto.name, email: dto.email };
    return this.profile;
  }
}

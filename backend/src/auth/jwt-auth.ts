import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import type { UserRecord } from '../users/users.service.js';
import { UsersService } from '../users/users.service.js';
import './authentication.types.js';

@Injectable()
export class JwtAuth extends JwtBearerProvider<UserRecord> {
  constructor(
    private readonly users: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  protected async validate({ sub }: JwtClaims) {
    if (!sub) return null;
    try {
      return await this.users.findOne(sub);
    } catch {
      return null;
    }
  }
}

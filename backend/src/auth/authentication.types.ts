import type { PublicUser } from '../users/entities/user.entity.js';

declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: PublicUser;
    refreshTokens: false;
  }
}

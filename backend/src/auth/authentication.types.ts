import type { UserRecord } from '../users/users.service.js';

declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: UserRecord;
    refreshTokens: false;
  }
}

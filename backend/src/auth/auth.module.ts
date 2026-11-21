import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module.js';
import { JwtAuth } from './jwt-auth.js';

@Module({
  imports: [
    AuthenticationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        accessToken: {
          key: config.getOrThrow<string>('JWT_SECRET'),
          issuer: 'interview-haupcar',
          audience: 'web',
          ttl: '1d',
        },
        refreshToken: false,
        allowInMemoryStorage: true,
      }),
    }),
    UsersModule,
  ],
  providers: [JwtAuth],
})
export class AuthModule {}

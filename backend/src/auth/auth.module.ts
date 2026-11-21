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
      useFactory: (config: ConfigService) => {
        const key =
          config.get<string>('JWT_SECRET') ??
          process.env.JWT_SECRET ??
          '';
        if (!key || key.length < 32) {
          throw new Error(
            'JWT_SECRET must be set (min 32 chars) in Vercel Environment Variables',
          );
        }
        return {
          accessToken: {
            key,
            issuer: 'interview-haupcar',
            audience: 'web',
            ttl: '1d',
          },
          refreshToken: false,
          allowInMemoryStorage: true,
        };
      },
    }),
    UsersModule,
  ],
  providers: [JwtAuth],
})
export class AuthModule {}

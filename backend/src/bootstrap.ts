import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { AppModule, ObserveInstrument } from './app.module.js';

let cachedApp: Express | undefined;

function configureApp(app: INestApplication) {
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  const corsOrigins =
    config.get<string>('CORS_ORIGINS')?.split(',').map((origin) => origin.trim()) ??
    [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'https://interview-haupcar-93hn.vercel.app',
      'https://interview-haupcar.vercel.app',
    ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (
        !origin ||
        corsOrigins.includes(origin) ||
        /\.vercel\.app$/i.test(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
}

/** Shared Nest bootstrap for local/Docker listen and Vercel serverless. */
export async function createExpressApp(): Promise<Express> {
  if (cachedApp) return cachedApp;

  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { instrument: ObserveInstrument },
  );
  configureApp(app);
  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

export function configureApp(app: INestApplication) {
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

/** Nest listen for local / Docker / official Vercel Nest runtime. */
export function createAppFactory(): {
  appPromise: Promise<INestApplication>;
} {
  const appPromise = (
    process.env.VERCEL
      ? NestFactory.create(AppModule)
      : NestFactory.create(AppModule, {
          instrument: ObserveInstrument,
        })
  ).then(async (app) => {
    configureApp(app);
    return app;
  });

  return { appPromise };
}

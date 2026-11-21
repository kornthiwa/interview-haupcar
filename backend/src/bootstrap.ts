import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

export function configureApp(app: INestApplication) {
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
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

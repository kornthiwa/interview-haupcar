import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { AppModule, ObserveInstrument } from './app.module.js';

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

/**
 * Factory used by local/Docker (listen) and Vercel (export Express app).
 * @see https://vercel.com/docs/frameworks/backend/express
 */
export function createAppFactory(): {
  appPromise: Promise<INestApplication>;
  expressApp: Express;
} {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const appPromise = NestFactory.create(AppModule, adapter, {
    instrument: ObserveInstrument,
  });

  appPromise
    .then(async (app) => {
      configureApp(app);
      await app.init();
    })
    .catch((error: unknown) => {
      console.error('Nest bootstrap failed', error);
      throw error;
    });

  // Ensure Nest is ready before handling a request on cold start
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    appPromise
      .then(async (app) => {
        await app.init();
        next();
      })
      .catch((error: unknown) => next(error));
  });

  return { appPromise, expressApp };
}

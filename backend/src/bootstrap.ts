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

/** Express app for Vercel + Nest listen for local/Docker. */
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
    });

  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    appPromise
      .then(async (app) => {
        await app.init();
        next();
      })
      .catch((error: unknown) => {
        console.error(error);
        if (!res.headersSent) {
          res.status(500).json({
            message: 'API bootstrap failed',
            detail: error instanceof Error ? error.message : String(error),
          });
        }
      });
  });

  return { appPromise, expressApp };
}

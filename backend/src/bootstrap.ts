import { ValidationPipe, type INestApplication } from '@nestjs/common';

/** Shared Nest setup for local/Docker (`main.ts`) and Vercel (`api/index.ts`). */
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

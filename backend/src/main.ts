import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { configureApp } from './bootstrap.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  configureApp(app);

  const config = app.get(ConfigService);
  await app.listen(config.get<string>('PORT') ?? 3000);
}

await bootstrap();

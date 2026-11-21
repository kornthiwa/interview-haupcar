import 'reflect-metadata';
import { createAppFactory } from './bootstrap.js';

async function bootstrap() {
  const { appPromise } = createAppFactory();
  const app = await appPromise;
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

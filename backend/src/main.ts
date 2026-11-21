import { createAppFactory } from './bootstrap.js';

async function bootstrap() {
  const { appPromise } = createAppFactory();
  const app = await appPromise;
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}

await bootstrap();

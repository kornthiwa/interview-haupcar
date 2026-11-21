import { createExpressApp } from './bootstrap.js';

async function bootstrap() {
  const expressApp = await createExpressApp();
  const port = Number(process.env.PORT ?? 3000);
  await new Promise<void>((resolve) => {
    expressApp.listen(port, '0.0.0.0', () => resolve());
  });
}

await bootstrap();

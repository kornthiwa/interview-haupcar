import type { IncomingMessage, ServerResponse } from 'node:http';
import { createExpressApp } from './bootstrap.js';

const appPromise = createExpressApp();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await appPromise;
  app(req, res);
}

import type { IncomingMessage, ServerResponse } from 'node:http'

type ExpressApp = {
  (req: IncomingMessage, res: ServerResponse): void
}

let boot: Promise<ExpressApp> | undefined

async function createServer(): Promise<ExpressApp> {
  await import('reflect-metadata')
  const express = (await import('express')).default
  const { NestFactory } = await import('@nestjs/core')
  const { ExpressAdapter } = await import('@nestjs/platform-express')
  const { AppModule } = await import('../src/app.module.js')
  const { configureApp } = await import('../src/app.setup.js')

  const server = express()
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server))
  configureApp(app)
  await app.init()
  return server
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    boot ??= createServer()
    const server = await boot
    server(req, res)
  } catch (error) {
    console.error('API bootstrap failed', error)
    if (res.headersSent) return
    res.statusCode = 500
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(
      JSON.stringify({
        message: 'API bootstrap failed',
        detail: error instanceof Error ? error.message : String(error),
      }),
    )
  }
}

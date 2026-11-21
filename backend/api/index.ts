import 'reflect-metadata'
import type { IncomingMessage, ServerResponse } from 'node:http'
import express, { type Express } from 'express'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { AppModule } from '../src/app.module.js'
import { configureApp } from '../src/bootstrap.js'

let boot: Promise<Express> | undefined

async function createServer(): Promise<Express> {
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
        stack: error instanceof Error ? error.stack : undefined,
      }),
    )
  }
}

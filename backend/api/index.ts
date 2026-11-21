import 'reflect-metadata'
import express from 'express'

let app: ReturnType<typeof express>

try {
  const { createAppFactory } = await import('../src/bootstrap.js')
  app = createAppFactory().expressApp
} catch (error) {
  console.error('API module load failed', error)
  app = express()
  app.use((_req, res) => {
    res.status(500).json({
      message: 'Failed to load API module',
      detail: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  })
}

export default app
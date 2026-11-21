import 'reflect-metadata'
import { createAppFactory } from '../dist/bootstrap.js'

// Vercel Express runtime: default-export the Express app instance
export default createAppFactory().expressApp

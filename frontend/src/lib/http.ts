import axios from 'axios'
import { env } from './env.ts'

export const http = axios.create({
  baseURL: env.apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

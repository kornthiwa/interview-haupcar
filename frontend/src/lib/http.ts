import axios from 'axios'
import { clearSession, getAccessToken } from '@/store/index.ts'
import { config } from './config.ts'

export const http = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const url = error.config?.url ?? ''
    const isCredentialRequest = url.includes('/users/login') || url.includes('/users/register')
    if (!isCredentialRequest) clearSession()
    return Promise.reject(error)
  },
)

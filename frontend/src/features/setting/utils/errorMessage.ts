import { isAxiosError } from 'axios'

export function errorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const data = error.response?.data
    if (data && typeof data === 'object' && 'message' in data) {
      const message = data.message
      if (typeof message === 'string') return message
      if (Array.isArray(message)) return message.map(String).join(', ')
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

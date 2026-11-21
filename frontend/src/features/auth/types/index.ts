import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1, 'Name is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export type AuthUser = {
  id: string
  name: string
  username: string
  createdAt: string
  updatedAt: string
}

export type LoginResponse = AuthUser & {
  accessToken: string
  expiresIn: number
}

import { http } from '@/lib/http.ts'
import { useAuthStore } from '@/store/index.ts'
import type { LoginInput, RegisterInput } from '../types/index.ts'
import type { AuthUser, LoginResponse } from '../types/index.ts'

export async function login(input: LoginInput) {
  const { data } = await http.post<LoginResponse>('/users/login', input)
  useAuthStore.getState().setSession({
    accessToken: data.accessToken,
    expiresIn: data.expiresIn,
    user: {
      id: data.id,
      name: data.name,
      username: data.username,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  })
  return data
}

export async function register(input: RegisterInput) {
  const { data } = await http.post<AuthUser>('/users/register', input)
  return data
}

export async function logout() {
  const accessToken = useAuthStore.getState().accessToken
  try {
    if (accessToken) await http.post('/users/logout', { accessToken })
  } finally {
    useAuthStore.getState().clearSession()
  }
}

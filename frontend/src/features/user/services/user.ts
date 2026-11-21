import { http } from '@/lib/http.ts'
import type { User } from '../types/index.ts'

export async function getUserById(id: string) {
  const { data } = await http.get<User>(`/users/${id}`)
  return data
}

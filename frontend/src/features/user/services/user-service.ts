import { http } from '@/lib/http.ts'
import type { UserFormValues } from '../schema.ts'

export type UserProfile = UserFormValues

export async function getUser() {
  const { data } = await http.get<UserProfile | null>('/users')
  return data
}

export async function saveUser(profile: UserFormValues) {
  const { data } = await http.put<UserProfile>('/users', profile)
  return data
}

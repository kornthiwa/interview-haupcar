import { http } from '@/lib/http.ts'

export async function getHome() {
  const { data } = await http.get<string>('/')
  return data
}

import { http } from '@/lib/http.ts'
import type { ListQuery, Paginated } from '@/types/pagination.ts'
import type { Brand } from '../types/index.ts'

export async function getBrands(query: ListQuery = {}) {
  const { data } = await http.get<Paginated<Brand>>('/brands', { params: query })
  return data
}

export async function getBrand(id: string) {
  const { data } = await http.get<Brand>(`/brands/${id}`)
  return data
}

export async function createBrand(body: Pick<Brand, 'name'>) {
  const { data } = await http.post<Brand>('/brands', body)
  return data
}

export async function updateBrand(id: string, body: Partial<Pick<Brand, 'name'>>) {
  const { data } = await http.patch<Brand>(`/brands/${id}`, body)
  return data
}

export async function deleteBrand(id: string) {
  await http.delete(`/brands/${id}`)
}

import { http } from '@/lib/http.ts'
import type { ListQuery, Paginated } from '@/types/pagination.ts'
import type { CarType } from '../types/index.ts'

export async function getCarTypes(query: ListQuery = {}) {
  const { data } = await http.get<Paginated<CarType>>('/car-types', {
    params: query,
  })
  return data
}

export async function getCarType(id: string) {
  const { data } = await http.get<CarType>(`/car-types/${id}`)
  return data
}

export async function createCarType(body: Pick<CarType, 'name'>) {
  const { data } = await http.post<CarType>('/car-types', body)
  return data
}

export async function updateCarType(
  id: string,
  body: Partial<Pick<CarType, 'name'>>,
) {
  const { data } = await http.patch<CarType>(`/car-types/${id}`, body)
  return data
}

export async function deleteCarType(id: string) {
  await http.delete(`/car-types/${id}`)
}

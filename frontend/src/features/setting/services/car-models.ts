import { http } from '@/lib/http.ts'
import type { CarModel } from '../types/index.ts'

export async function getCarModels() {
  const { data } = await http.get<CarModel[]>('/car-models')
  return data
}

export async function getCarModel(id: string) {
  const { data } = await http.get<CarModel>(`/car-models/${id}`)
  return data
}

export async function createCarModel(body: Pick<CarModel, 'name' | 'brandId'>) {
  const { data } = await http.post<CarModel>('/car-models', body)
  return data
}

export async function updateCarModel(
  id: string,
  body: Partial<Pick<CarModel, 'name' | 'brandId'>>,
) {
  const { data } = await http.patch<CarModel>(`/car-models/${id}`, body)
  return data
}

export async function deleteCarModel(id: string) {
  await http.delete(`/car-models/${id}`)
}

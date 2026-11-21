import { http } from '@/lib/http.ts'
import type { Car } from '../types/index.ts'

export type CreateCarInput = {
  licensePlate: string
  color: string
  pricePerDay: number
  status?: Car['status']
  rentalDate?: string
  dueDate?: string
  typeId: string
  carModelId: string
}

export type UpdateCarInput = Partial<CreateCarInput>

export async function getCars() {
  const { data } = await http.get<Car[]>('/cars')
  return data
}

export async function getCar(id: string) {
  const { data } = await http.get<Car>(`/cars/${id}`)
  return data
}

export async function createCar(body: CreateCarInput) {
  const { data } = await http.post<Car>('/cars', body)
  return data
}

export async function updateCar(id: string, body: UpdateCarInput) {
  const { data } = await http.patch<Car>(`/cars/${id}`, body)
  return data
}

export async function deleteCar(id: string) {
  await http.delete(`/cars/${id}`)
}

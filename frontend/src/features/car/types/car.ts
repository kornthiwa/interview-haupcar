export type CarStatus = 'available' | 'rented' | 'maintenance'

export type Car = {
  id: string
  licensePlate: string
  color: string
  pricePerDay: number
  status: CarStatus
  rentalDate: string | null
  dueDate: string | null
  typeId: string
  carModelId: string
  createdAt: string
  updatedAt: string
}

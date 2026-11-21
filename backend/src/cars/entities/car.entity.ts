import { CarStatus } from '@prisma/client';

export class Car {
  id: string;
  licensePlate: string;
  color: string;
  pricePerDay: number;
  status: CarStatus;
  rentalDate: Date | null;
  dueDate: Date | null;
  notes: string | null;
  typeId: string;
  carModelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export { CarStatus };

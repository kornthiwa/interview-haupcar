import type { Id } from '@/types/index.ts'

export type Appointment = {
  id: Id
  patientId: Id
  scheduledAt: string
}

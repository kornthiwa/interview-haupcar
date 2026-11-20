import type { Appointment } from '../types/index.ts'

const appointments: Appointment[] = [
  {
    id: 'a-1',
    patientId: 'p-1',
    scheduledAt: '2026-11-20T09:00:00',
  },
]

export function listAppointments() {
  return appointments
}

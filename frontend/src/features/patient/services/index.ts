import type { Patient } from '../types/index.ts'

const patients: Patient[] = [
  { id: 'p-1', firstName: 'Somchai', lastName: 'Jaidee' },
]

export function listPatients() {
  return patients
}

import type { Medication } from '../types/index.ts'

const medications: Medication[] = [
  { id: 'm-1', name: 'Paracetamol', dosage: '500 mg' },
]

export function listMedications() {
  return medications
}

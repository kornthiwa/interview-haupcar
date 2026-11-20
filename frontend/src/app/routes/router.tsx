import { Navigate, createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layouts/index.ts'
import { AppointmentPage } from '@/features/appointment/index.ts'
import { MedicationPage } from '@/features/medication/index.ts'
import { PatientPage } from '@/features/patient/index.ts'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/patients" replace /> },
      { path: 'patients', element: <PatientPage /> },
      { path: 'appointments', element: <AppointmentPage /> },
      { path: 'medications', element: <MedicationPage /> },
    ],
  },
])

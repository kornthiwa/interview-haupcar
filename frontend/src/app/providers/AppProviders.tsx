import { RouterProvider } from 'react-router'
import { router } from '@/app/routes/index.ts'

export function AppProviders() {
  return <RouterProvider router={router} />
}

import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layouts/index.ts'
import { HomePage } from '@/features/home/index.ts'
import { UserPage } from '@/features/user/index.ts'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'user', element: <UserPage /> },
    ],
  },
])

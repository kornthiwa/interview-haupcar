import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layouts/index.ts'
import { HomePage } from '@/features/home/index.ts'
import { UserPage } from '@/features/user/index.ts'
import { paths } from './paths.ts'

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.user, element: <UserPage /> },
    ],
  },
])

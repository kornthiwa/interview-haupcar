import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layouts/index.ts'
import { HomePage } from '@/features/home/index.ts'
import { UserPage } from '@/features/user/index.ts'
import { AuthGuard, GuestGuard } from '@/features/auth/components/AuthGuard.tsx'
import { Login } from '@/features/auth/components/Login.tsx'
import { Register } from '@/features/auth/components/Register.tsx'
import { paths } from './paths.ts'

export const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      {
        path: paths.home,
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: paths.user, element: <UserPage /> },
        ],
      },
    ],
  },
  {
    element: <GuestGuard />,
    children: [
      { path: paths.login, element: <Login /> },
      { path: paths.register, element: <Register /> },
    ],
  },
])

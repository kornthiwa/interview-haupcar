import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layouts/index.ts'
import { CarPage } from '@/features/car/index.ts'
import { UserPage } from '@/features/user/index.ts'
import { AuthGuard, GuestGuard } from '@/features/auth/index.ts'
import { paths } from './paths.ts'
import { SettingPage } from '@/features/setting/index.ts'
import { Login, Register } from '@/features/auth/index.ts'

export const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      {
        path: paths.car,
        element: <AppLayout />,
        children: [
          { index: true, element: <CarPage /> },
          { path: paths.profile, element: <UserPage /> },
          { path: paths.settings, element: <SettingPage /> },
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

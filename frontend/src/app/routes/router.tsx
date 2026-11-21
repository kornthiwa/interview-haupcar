import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layouts/index.ts'
import { HomePage } from '@/features/home/index.ts'
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
        path: paths.home,
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
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

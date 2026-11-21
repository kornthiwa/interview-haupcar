import { Navigate, Outlet } from 'react-router'
import { paths } from '@/app/routes/paths.ts'
import { useAuthStore } from '@/store/index.ts'

export function AuthGuard() {
  const accessToken = useAuthStore((state) => state.accessToken)
  if (!accessToken) return <Navigate to={paths.login} replace />
  return <Outlet />
}

export function GuestGuard() {
  const accessToken = useAuthStore((state) => state.accessToken)
  if (accessToken) return <Navigate to={paths.home} replace />
  return <Outlet />
}

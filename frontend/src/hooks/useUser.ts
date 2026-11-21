import { useAuthStore } from '@/store/index.ts'
import type { AuthUser } from '@/features/auth/types/index.ts'

export function getUser(): AuthUser | null {
  return useAuthStore.getState().user
}

export function useUser() {
  return useAuthStore((state) => state.user)
}

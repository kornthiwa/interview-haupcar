import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/features/auth/types/index.ts'

type AuthState = {
  accessToken: string | null
  expiresAt: number | null
  user: AuthUser | null
  setSession: (session: {
    accessToken: string
    expiresIn: number
    user: AuthUser
  }) => void
  clearSession: () => void
}

function isExpired(expiresAt: number | null) {
  return expiresAt != null && expiresAt <= Date.now()
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresAt: null,
      user: null,
      setSession: ({ accessToken, expiresIn, user }) => {
        const seconds = Number(expiresIn)
        const ttl = Number.isFinite(seconds) && seconds > 0 ? seconds : 15 * 60
        set({
          accessToken,
          expiresAt: Date.now() + ttl * 1000,
          user,
        })
      },
      clearSession: () => {
        set({ accessToken: null, expiresAt: null, user: null })
      },
    }),
    {
      name: 'auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (isExpired(state.expiresAt)) state.clearSession()
      },
    },
  ),
)

export function getAccessToken() {
  const { accessToken, expiresAt, clearSession } = useAuthStore.getState()
  if (!accessToken) return null
  if (isExpired(expiresAt)) {
    clearSession()
    return null
  }
  return accessToken
}

export function clearSession() {
  useAuthStore.getState().clearSession()
}

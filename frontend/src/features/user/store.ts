import { create } from 'zustand'
import type { UserFormValues } from './schema.ts'

type UserState = {
  profile: UserFormValues | null
  setProfile: (profile: UserFormValues | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}))

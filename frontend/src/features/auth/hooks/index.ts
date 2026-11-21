import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/store/index.ts'
import { login, logout, register } from '../services/index.ts'

function errorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const data = error.response?.data
    if (data && typeof data === 'object' && 'message' in data) {
      const message = data.message
      if (typeof message === 'string') return message
      if (Array.isArray(message)) return message.map(String).join(', ')
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

export function useAuth() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.clear()
    },
  })

  const registerMutation = useMutation({
    mutationFn: register,
  })

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
    },
  })

  return {
    user,
    isAuthenticated: Boolean(accessToken),
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error ? errorMessage(loginMutation.error) : null,
    registerError: registerMutation.error ? errorMessage(registerMutation.error) : null,
  }
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect } from 'react'
import type { UserFormValues } from '../schema.ts'
import { getUser, saveUser } from '../services/index.ts'
import { useUserStore } from '../store.ts'

export const userQueryKey = ['user'] as const

function errorMessage(error: unknown) {
  if (isAxiosError(error)) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}

export function useUserProfile() {
  const setProfile = useUserStore((state) => state.setProfile)
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: userQueryKey,
    queryFn: getUser,
  })
  const mutation = useMutation({
    mutationFn: saveUser,
    onSuccess: (profile) => {
      setProfile(profile)
      queryClient.setQueryData(userQueryKey, profile)
    },
  })

  useEffect(() => {
    if (query.isSuccess) setProfile(query.data)
  }, [query.data, query.isSuccess, setProfile])

  const error = mutation.error ?? query.error

  return {
    profile: query.data ?? null,
    save: (values: UserFormValues) => mutation.mutate(values),
    isSaving: mutation.isPending,
    error: error ? errorMessage(error) : null,
  }
}

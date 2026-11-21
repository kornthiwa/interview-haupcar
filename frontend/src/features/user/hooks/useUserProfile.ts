import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/hooks/index.ts'
import { getUserById } from '../services/index.ts'

export const userQueryKey = (id: string) => ['users', id] as const

export function useUserProfile() {
  const sessionUser = useUser()
  const id = sessionUser?.id

  const query = useQuery({
    queryKey: userQueryKey(id ?? ''),
    queryFn: () => getUserById(id!),
    enabled: Boolean(id),
  })

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

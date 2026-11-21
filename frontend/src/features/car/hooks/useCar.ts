import { useQuery } from '@tanstack/react-query'
import { getCars } from '../services/index.ts'

export const carsQueryKey = () => ['cars'] as const

export function useCars() {
  const query = useQuery({
    queryKey: carsQueryKey(),
    queryFn: () => getCars(),
  })

  return {
    cars: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

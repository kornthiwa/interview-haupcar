import { useQuery } from '@tanstack/react-query'
import type { ListQuery } from '@/types/pagination.ts'
import { getCars } from '../services/index.ts'

export const carsQueryKey = (query?: ListQuery) =>
  query ? (['cars', query] as const) : (['cars'] as const)

export function useCars(query: ListQuery = {}) {
  const listQuery = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
    q: query.q?.trim() || undefined,
  }

  const result = useQuery({
    queryKey: carsQueryKey(listQuery),
    queryFn: () => getCars(listQuery),
  })

  return {
    cars: result.data?.data ?? [],
    meta: result.data?.meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

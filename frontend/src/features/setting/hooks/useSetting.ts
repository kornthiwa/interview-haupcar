import { useQuery } from '@tanstack/react-query'
import type { ListQuery } from '@/types/pagination.ts'
import { getBrands, getCarModels, getCarTypes } from '../services/index.ts'

export const carTypesQueryKey = (query?: ListQuery) =>
  query ? (['car-types', query] as const) : (['car-types'] as const)

export const carModelsQueryKey = (query?: ListQuery) =>
  query ? (['car-models', query] as const) : (['car-models'] as const)

export const brandsQueryKey = (query?: ListQuery) =>
  query ? (['brands', query] as const) : (['brands'] as const)

export function useCarTypes(query: ListQuery = {}) {
  const listQuery = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
    q: query.q?.trim() || undefined,
  }

  const result = useQuery({
    queryKey: carTypesQueryKey(listQuery),
    queryFn: () => getCarTypes(listQuery),
  })

  return {
    carTypes: result.data?.data ?? [],
    meta: result.data?.meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

export function useCarModels(query: ListQuery = {}) {
  const listQuery = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
    q: query.q?.trim() || undefined,
  }

  const result = useQuery({
    queryKey: carModelsQueryKey(listQuery),
    queryFn: () => getCarModels(listQuery),
  })

  return {
    carModels: result.data?.data ?? [],
    meta: result.data?.meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

export function useBrands(query: ListQuery = {}) {
  const listQuery = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
    q: query.q?.trim() || undefined,
  }

  const result = useQuery({
    queryKey: brandsQueryKey(listQuery),
    queryFn: () => getBrands(listQuery),
  })

  return {
    brands: result.data?.data ?? [],
    meta: result.data?.meta,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

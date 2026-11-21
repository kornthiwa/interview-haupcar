import { useQuery } from '@tanstack/react-query'
import { getBrands, getCarModels, getCarTypes } from '../services/index.ts'

export const carTypesQueryKey = () => ['car-types'] as const
export const carModelsQueryKey = () => ['car-models'] as const
export const brandsQueryKey = () => ['brands'] as const

export function useCarTypes() {
  const query = useQuery({
    queryKey: carTypesQueryKey(),
    queryFn: () => getCarTypes(),
  })
  return {
    carTypes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useCarModels() {
  const query = useQuery({
    queryKey: carModelsQueryKey(),
    queryFn: () => getCarModels(),
  })
  return {
    carModels: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useBrands() {
  const query = useQuery({
    queryKey: brandsQueryKey(),
    queryFn: () => getBrands(),
  })
  return {
    brands: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

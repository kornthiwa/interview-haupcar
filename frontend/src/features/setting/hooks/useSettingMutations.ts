import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createBrand,
  createCarModel,
  createCarType,
  deleteBrand,
  deleteCarModel,
  deleteCarType,
  updateBrand,
  updateCarModel,
  updateCarType,
} from '../services/index.ts'
import {
  brandsQueryKey,
  carModelsQueryKey,
  carTypesQueryKey,
} from './useSetting.ts'

export function useSettingMutations() {
  const queryClient = useQueryClient()

  function invalidateAll() {
    void queryClient.invalidateQueries({ queryKey: carTypesQueryKey() })
    void queryClient.invalidateQueries({ queryKey: carModelsQueryKey() })
    void queryClient.invalidateQueries({ queryKey: brandsQueryKey() })
  }

  const createCarTypeMutation = useMutation({
    mutationFn: (name: string) => createCarType({ name }),
    onSuccess: invalidateAll,
  })

  const updateCarTypeMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCarType(id, { name }),
    onSuccess: invalidateAll,
  })

  const deleteCarTypeMutation = useMutation({
    mutationFn: (id: string) => deleteCarType(id),
    onSuccess: invalidateAll,
  })

  const createBrandMutation = useMutation({
    mutationFn: (name: string) => createBrand({ name }),
    onSuccess: invalidateAll,
  })

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateBrand(id, { name }),
    onSuccess: invalidateAll,
  })

  const deleteBrandMutation = useMutation({
    mutationFn: (id: string) => deleteBrand(id),
    onSuccess: invalidateAll,
  })

  const createCarModelMutation = useMutation({
    mutationFn: (input: { name: string; brandId: string }) =>
      createCarModel(input),
    onSuccess: invalidateAll,
  })

  const updateCarModelMutation = useMutation({
    mutationFn: ({
      id,
      name,
      brandId,
    }: {
      id: string
      name: string
      brandId: string
    }) => updateCarModel(id, { name, brandId }),
    onSuccess: invalidateAll,
  })

  const deleteCarModelMutation = useMutation({
    mutationFn: (id: string) => deleteCarModel(id),
    onSuccess: invalidateAll,
  })

  return {
    createCarTypeMutation,
    updateCarTypeMutation,
    deleteCarTypeMutation,
    createBrandMutation,
    updateBrandMutation,
    deleteBrandMutation,
    createCarModelMutation,
    updateCarModelMutation,
    deleteCarModelMutation,
  }
}

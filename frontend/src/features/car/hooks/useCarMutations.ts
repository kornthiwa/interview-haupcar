import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCar,
  deleteCar,
  updateCar,
  type CreateCarInput,
  type UpdateCarInput,
} from '../services/index.ts'
import { carsQueryKey } from './useCar.ts'

export function useCarMutations() {
  const queryClient = useQueryClient()

  function invalidateCars() {
    void queryClient.invalidateQueries({ queryKey: carsQueryKey() })
  }

  const createCarMutation = useMutation({
    mutationFn: (input: CreateCarInput) => createCar(input),
    onSuccess: invalidateCars,
  })

  const updateCarMutation = useMutation({
    mutationFn: ({ id, ...body }: UpdateCarInput & { id: string }) =>
      updateCar(id, body),
    onSuccess: invalidateCars,
  })

  const deleteCarMutation = useMutation({
    mutationFn: (id: string) => deleteCar(id),
    onSuccess: invalidateCars,
  })

  return {
    createCarMutation,
    updateCarMutation,
    deleteCarMutation,
  }
}

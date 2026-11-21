import { useEffect, useMemo, useState } from 'react'
import { DataTable, type Column } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { SearchForm } from '@/components/shared/SearchForm/index.tsx'
import { Button } from '@/components/ui/Button/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useCarModels, useCarTypes } from '@/features/setting/index.ts'
import { useCarMutations, useCars } from '../hooks/index.ts'
import type { Car, CarStatus } from '../types/index.ts'
import { errorMessage } from '../utils/errorMessage.ts'
import {
  CarFormDialog,
  type CarDialogMode,
  type CarFormValues,
} from './CarFormDialog.tsx'

const PAGE_SIZE = 10

const emptyForm: CarFormValues = {
  licensePlate: '',
  color: '',
  pricePerDay: '',
  status: 'available',
  rentalDate: '',
  dueDate: '',
  notes: '',
  typeId: '',
  carModelId: '',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function toDateInput(value: string | null) {
  if (!value) return ''
  return value.slice(0, 10)
}

function toCarFormValues(car: Car): CarFormValues {
  return {
    licensePlate: car.licensePlate,
    color: car.color,
    pricePerDay: String(car.pricePerDay),
    status: car.status,
    rentalDate: toDateInput(car.rentalDate),
    dueDate: toDateInput(car.dueDate),
    notes: car.notes ?? '',
    typeId: car.typeId,
    carModelId: car.carModelId,
  }
}

type CarTableProps = {
  createRequest?: number
}

export function CarTable({ createRequest = 0 }: CarTableProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState<CarDialogMode | null>(null)
  const [selected, setSelected] = useState<Car | null>(null)
  const [values, setValues] = useState<CarFormValues>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)

  const { cars, meta, isLoading, isError } = useCars({
    page,
    pageSize: PAGE_SIZE,
    q: search,
  })
  const carTypes = useCarTypes({ page: 1, pageSize: 100 })
  const carModels = useCarModels({ page: 1, pageSize: 100 })
  const { createCarMutation, updateCarMutation, deleteCarMutation } =
    useCarMutations()

  const isSaving =
    createCarMutation.isPending ||
    updateCarMutation.isPending ||
    deleteCarMutation.isPending

  const typeOptions = useMemo(
    () =>
      carTypes.carTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })),
    [carTypes.carTypes],
  )

  const carModelOptions = useMemo(
    () =>
      carModels.carModels.map((model) => ({
        value: model.id,
        label: model.name,
      })),
    [carModels.carModels],
  )

  function openCreate() {
    setSelected(null)
    setValues({
      ...emptyForm,
      typeId: carTypes.carTypes[0]?.id ?? '',
      carModelId: carModels.carModels[0]?.id ?? '',
    })
    setFormError(null)
    setMode('create')
  }

  useEffect(() => {
    if (createRequest > 0) openCreate()
  }, [createRequest])

  function openEdit(row: Car) {
    setSelected(row)
    setValues(toCarFormValues(row))
    setFormError(null)
    setMode('edit')
  }

  function openView(row: Car) {
    setSelected(row)
    setValues(toCarFormValues(row))
    setFormError(null)
    setMode('view')
  }

  function openDelete(row: Car) {
    setSelected(row)
    setValues(toCarFormValues(row))
    setFormError(null)
    setMode('delete')
  }

  function closeDialog() {
    if (isSaving) return
    setMode(null)
    setSelected(null)
    setFormError(null)
  }

  function handleChange(field: keyof CarFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleConfirm() {
    setFormError(null)
    try {
      if (mode === 'create' || mode === 'edit') {
        const licensePlate = values.licensePlate.trim()
        const color = values.color.trim()
        const pricePerDay = Number(values.pricePerDay)

        if (!licensePlate) {
          setFormError('License plate is required')
          return
        }
        if (!color) {
          setFormError('Color is required')
          return
        }
        if (!Number.isInteger(pricePerDay) || pricePerDay <= 0) {
          setFormError('Price per day must be a positive integer')
          return
        }
        if (!values.typeId) {
          setFormError('Car type is required')
          return
        }
        if (!values.carModelId) {
          setFormError('Car model is required')
          return
        }

        const payload = {
          licensePlate,
          color,
          pricePerDay,
          status: values.status as CarStatus,
          rentalDate: values.rentalDate || undefined,
          dueDate: values.dueDate || undefined,
          notes: values.notes.trim() || undefined,
          typeId: values.typeId,
          carModelId: values.carModelId,
        }

        if (mode === 'create') {
          await createCarMutation.mutateAsync(payload)
        } else if (selected) {
          await updateCarMutation.mutateAsync({ id: selected.id, ...payload })
        }
      }

      if (mode === 'delete' && selected) {
        await deleteCarMutation.mutateAsync(selected.id)
      }

      setMode(null)
      setSelected(null)
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  const columns = useMemo<Column<Car>[]>(
    () => [
      {
        key: 'id',
        header: 'ID',
        render: (row) => String(row.id),
      },
      { key: 'licensePlate', header: 'License Plate' },
      { key: 'color', header: 'Color' },
      {
        key: 'pricePerDay',
        header: 'Price / Day',
        render: (row) => String(row.pricePerDay),
      },
      { key: 'status', header: 'Status' },
      {
        key: 'rentalDate',
        header: 'Rental Date',
        render: (row) => (row.rentalDate ? formatDate(row.rentalDate) : '-'),
      },
      {
        key: 'dueDate',
        header: 'Due Date',
        render: (row) => (row.dueDate ? formatDate(row.dueDate) : '-'),
      },
      {
        key: 'notes',
        header: 'Notes',
        render: (row) => row.notes || '-',
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={() => openView(row)}>
              View
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => openEdit(row)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => openDelete(row)}
            >
              Delete
            </Button>
          </Stack>
        ),
      },
    ],
    [],
  )

  return (
    <Stack spacing={2}>
      <SearchForm
        placeholder="Search by plate, color, or status"
        defaultValue={search}
        onSearch={(query) => {
          setSearch(query)
          setPage(1)
        }}
      />

      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading cars…
        </Typography>
      ) : isError ? (
        <Typography variant="body2" color="error">
          Failed to load cars
        </Typography>
      ) : (
        <>
          <DataTable columns={columns} rows={cars} getRowId={(row) => row.id} />
          <Pagination
            page={page}
            pageCount={meta?.pageCount ?? 1}
            onPageChange={setPage}
          />
        </>
      )}

      <CarFormDialog
        open={mode != null}
        mode={mode}
        values={values}
        selectedLabel={selected?.licensePlate}
        typeOptions={typeOptions}
        carModelOptions={carModelOptions}
        formError={formError}
        isSaving={isSaving}
        onChange={handleChange}
        onClose={closeDialog}
        onConfirm={() => void handleConfirm()}
      />
    </Stack>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { DataTable, type Column } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { Button } from '@/components/ui/Button/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import {
  useBrands,
  useCarModels,
  useSettingMutations,
} from '../hooks/index.ts'
import type { CarModel } from '../types/index.ts'
import { errorMessage } from '../utils/errorMessage.ts'
import {
  SettingFormDialog,
  type SettingDialogMode,
} from './SettingFormDialog.tsx'

const PAGE_SIZE = 10

type CarModelsTableProps = {
  createRequest?: number
}

export function CarModelsTable({ createRequest = 0 }: CarModelsTableProps) {
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState<SettingDialogMode | null>(null)
  const [selected, setSelected] = useState<CarModel | null>(null)
  const [name, setName] = useState('')
  const [brandId, setBrandId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const { carModels, isLoading, isError } = useCarModels()
  const brands = useBrands()
  const {
    createCarModelMutation,
    updateCarModelMutation,
    deleteCarModelMutation,
  } = useSettingMutations()

  const isSaving =
    createCarModelMutation.isPending ||
    updateCarModelMutation.isPending ||
    deleteCarModelMutation.isPending

  const brandNameById = useMemo(
    () => new Map(brands.brands.map((brand) => [brand.id, brand.name])),
    [brands.brands],
  )

  const brandOptions = useMemo(
    () =>
      brands.brands.map((brand) => ({
        value: brand.id,
        label: brand.name,
      })),
    [brands.brands],
  )

  const pageCount = Math.max(1, Math.ceil(carModels.length / PAGE_SIZE))
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return carModels.slice(start, start + PAGE_SIZE)
  }, [carModels, page])

  function openCreate() {
    setSelected(null)
    setName('')
    setBrandId(brands.brands[0]?.id ?? '')
    setFormError(null)
    setMode('create')
  }

  useEffect(() => {
    if (createRequest > 0) openCreate()
  }, [createRequest])

  function openEdit(row: CarModel) {
    setSelected(row)
    setName(row.name)
    setBrandId(row.brandId)
    setFormError(null)
    setMode('edit')
  }

  function openView(row: CarModel) {
    setSelected(row)
    setName(row.name)
    setBrandId(row.brandId)
    setFormError(null)
    setMode('view')
  }

  function openDelete(row: CarModel) {
    setSelected(row)
    setName(row.name)
    setBrandId(row.brandId)
    setFormError(null)
    setMode('delete')
  }

  function closeDialog() {
    if (isSaving) return
    setMode(null)
    setSelected(null)
    setFormError(null)
  }

  async function handleConfirm() {
    setFormError(null)
    try {
      if (mode === 'create') {
        if (!name.trim()) {
          setFormError('Name is required')
          return
        }
        if (!brandId) {
          setFormError('Brand is required')
          return
        }
        await createCarModelMutation.mutateAsync({
          name: name.trim(),
          brandId,
        })
      }
      if (mode === 'edit' && selected) {
        if (!name.trim()) {
          setFormError('Name is required')
          return
        }
        if (!brandId) {
          setFormError('Brand is required')
          return
        }
        await updateCarModelMutation.mutateAsync({
          id: selected.id,
          name: name.trim(),
          brandId,
        })
      }
      if (mode === 'delete' && selected) {
        await deleteCarModelMutation.mutateAsync(selected.id)
      }
      setMode(null)
      setSelected(null)
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  const columns = useMemo<Column<CarModel>[]>(
    () => [
      { key: 'id', header: 'ID', render: (row) => row.id },
      { key: 'name', header: 'Name' },
      {
        key: 'brandId',
        header: 'Brand',
        render: (row) => brandNameById.get(row.brandId) ?? row.brandId,
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
    [brandNameById],
  )

  return (
    <Stack spacing={2}>
      {isLoading || brands.isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      ) : isError || brands.isError ? (
        <Typography variant="body2" color="error">
          Failed to load data
        </Typography>
      ) : (
        <>
          <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </>
      )}

      <SettingFormDialog
        open={mode != null}
        mode={mode}
        entityLabel="Car Model"
        name={name}
        selectedName={selected?.name}
        brandId={brandId}
        brandOptions={brandOptions}
        showBrand
        formError={formError}
        isSaving={isSaving}
        onNameChange={setName}
        onBrandChange={setBrandId}
        onClose={closeDialog}
        onConfirm={() => void handleConfirm()}
      />
    </Stack>
  )
}

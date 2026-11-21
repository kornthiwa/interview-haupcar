import { useEffect, useMemo, useState } from 'react'
import { DataTable, type Column } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { SearchForm } from '@/components/shared/SearchForm/index.tsx'
import { Button } from '@/components/ui/Button/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useCarTypes, useSettingMutations } from '../hooks/index.ts'
import type { CarType } from '../types/index.ts'
import { errorMessage } from '../utils/errorMessage.ts'
import {
  SettingFormDialog,
  type SettingDialogMode,
} from './SettingFormDialog.tsx'

const PAGE_SIZE = 10

type CarTypesTableProps = {
  createRequest?: number
}

export function CarTypesTable({ createRequest = 0 }: CarTypesTableProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState<SettingDialogMode | null>(null)
  const [selected, setSelected] = useState<CarType | null>(null)
  const [name, setName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const { carTypes, meta, isLoading, isError } = useCarTypes({
    page,
    pageSize: PAGE_SIZE,
    q: search,
  })
  const {
    createCarTypeMutation,
    updateCarTypeMutation,
    deleteCarTypeMutation,
  } = useSettingMutations()

  const isSaving =
    createCarTypeMutation.isPending ||
    updateCarTypeMutation.isPending ||
    deleteCarTypeMutation.isPending

  function openCreate() {
    setSelected(null)
    setName('')
    setFormError(null)
    setMode('create')
  }

  useEffect(() => {
    if (createRequest > 0) openCreate()
  }, [createRequest])

  function openEdit(row: CarType) {
    setSelected(row)
    setName(row.name)
    setFormError(null)
    setMode('edit')
  }

  function openView(row: CarType) {
    setSelected(row)
    setName(row.name)
    setFormError(null)
    setMode('view')
  }

  function openDelete(row: CarType) {
    setSelected(row)
    setName(row.name)
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
        await createCarTypeMutation.mutateAsync(name.trim())
      }
      if (mode === 'edit' && selected) {
        if (!name.trim()) {
          setFormError('Name is required')
          return
        }
        await updateCarTypeMutation.mutateAsync({
          id: selected.id,
          name: name.trim(),
        })
      }
      if (mode === 'delete' && selected) {
        await deleteCarTypeMutation.mutateAsync(selected.id)
      }
      setMode(null)
      setSelected(null)
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  const columns = useMemo<Column<CarType>[]>(
    () => [
      { key: 'id', header: 'ID', render: (row) => row.id },
      { key: 'name', header: 'Name' },
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
        placeholder="Search car types"
        defaultValue={search}
        onSearch={(query) => {
          setSearch(query)
          setPage(1)
        }}
      />

      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      ) : isError ? (
        <Typography variant="body2" color="error">
          Failed to load data
        </Typography>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={carTypes}
            getRowId={(row) => row.id}
          />
          <Pagination
            page={page}
            pageCount={meta?.pageCount ?? 1}
            onPageChange={setPage}
          />
        </>
      )}

      <SettingFormDialog
        open={mode != null}
        mode={mode}
        entityLabel="Car Type"
        name={name}
        selectedName={selected?.name}
        formError={formError}
        isSaving={isSaving}
        onNameChange={setName}
        onClose={closeDialog}
        onConfirm={() => void handleConfirm()}
      />
    </Stack>
  )
}

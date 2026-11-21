import { useMemo, useState } from 'react'
import { DataTable, type Column } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useCars } from '../hooks/index.ts'
import type { Car } from '../types/index.ts'

const PAGE_SIZE = 10

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function buildColumns(page: number): Column<Car>[] {
  const offset = (page - 1) * PAGE_SIZE
  return [
    {
      key: 'id',
      header: '#',
      render: (_row, index) => String(offset + index + 1),
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
  ]
}

export function CarTable() {
  const { cars, isLoading, isError } = useCars()
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(cars.length / PAGE_SIZE))
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return cars.slice(start, start + PAGE_SIZE)
  }, [cars, page])
  const columns = useMemo(() => buildColumns(page), [page])

  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading cars…
      </Typography>
    )
  }

  if (isError) {
    return (
      <Typography variant="body2" color="error">
        Failed to load cars
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </Stack>
  )
}

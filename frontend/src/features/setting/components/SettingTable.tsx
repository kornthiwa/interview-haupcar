import { useMemo, useState } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { DataTable, type Column } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useBrands, useCarModels, useCarTypes } from '../hooks/index.ts'

const PAGE_SIZE = 10

const TableType = {
  CarTypes: 'carTypes',
  CarModels: 'carModels',
  Brands: 'brands',
} as const

type TableType = (typeof TableType)[keyof typeof TableType]

type SettingRow = {
  id: string
  name: string
  brandId?: string
}

const tableOptions = [
  { value: TableType.CarTypes, label: 'Car Types' },
  { value: TableType.CarModels, label: 'Car Models' },
  { value: TableType.Brands, label: 'Brands' },
] as const

function buildBaseColumns(page: number): Column<SettingRow>[] {
  const offset = (page - 1) * PAGE_SIZE
  return [
    {
      key: 'id',
      header: '#',
      render: (_row, index) => String(offset + index + 1),
    },
    { key: 'name', header: 'Name' },
  ]
}

function buildCarModelColumns(
  page: number,
  brandNameById: Map<string, string>,
): Column<SettingRow>[] {
  return [
    ...buildBaseColumns(page),
    {
      key: 'brandId',
      header: 'Brand',
      render: (row) =>
        row.brandId
          ? (brandNameById.get(row.brandId) ?? row.brandId)
          : '-',
    },
  ]
}

export function SettingTable() {
  const [tableType, setTableType] = useState<TableType>(TableType.CarTypes)
  const [page, setPage] = useState(1)
  const carTypes = useCarTypes()
  const carModels = useCarModels()
  const brands = useBrands()

  const brandNameById = useMemo(
    () => new Map(brands.brands.map((brand) => [brand.id, brand.name])),
    [brands.brands],
  )

  const tables = useMemo(
    () => ({
      [TableType.CarTypes]: {
        rows: carTypes.carTypes,
        columns: buildBaseColumns(page),
        isLoading: carTypes.isLoading,
        isError: carTypes.isError,
      },
      [TableType.CarModels]: {
        rows: carModels.carModels,
        columns: buildCarModelColumns(page, brandNameById),
        isLoading: carModels.isLoading || brands.isLoading,
        isError: carModels.isError || brands.isError,
      },
      [TableType.Brands]: {
        rows: brands.brands,
        columns: buildBaseColumns(page),
        isLoading: brands.isLoading,
        isError: brands.isError,
      },
    }),
    [
      brandNameById,
      brands.brands,
      brands.isError,
      brands.isLoading,
      carModels.carModels,
      carModels.isError,
      carModels.isLoading,
      carTypes.carTypes,
      carTypes.isError,
      carTypes.isLoading,
      page,
    ],
  )

  const { rows: allRows, columns, isLoading, isError } = tables[tableType]
  const pageCount = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE))
  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return allRows.slice(start, start + PAGE_SIZE)
  }, [allRows, page])

  function handleTabChange(_event: unknown, value: TableType) {
    setTableType(value)
    setPage(1)
  }

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Tabs value={tableType} onChange={handleTabChange}>
          {tableOptions.map((option) => (
            <Tab key={option.value} value={option.value} label={option.label} />
          ))}
        </Tabs>
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      </Stack>
    )
  }

  if (isError) {
    return (
      <Stack spacing={2}>
        <Tabs value={tableType} onChange={handleTabChange}>
          {tableOptions.map((option) => (
            <Tab key={option.value} value={option.value} label={option.label} />
          ))}
        </Tabs>
        <Typography variant="body2" color="error">
          Failed to load data
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <Tabs value={tableType} onChange={handleTabChange}>
        {tableOptions.map((option) => (
          <Tab key={option.value} value={option.value} label={option.label} />
        ))}
      </Tabs>
      <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </Stack>
  )
}

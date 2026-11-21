import { useState } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { Button } from '@/components/ui/Button/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { BrandsTable } from './BrandsTable.tsx'
import { CarModelsTable } from './CarModelsTable.tsx'
import { CarTypesTable } from './CarTypesTable.tsx'

const TableType = {
  CarTypes: 'carTypes',
  CarModels: 'carModels',
  Brands: 'brands',
} as const

type TableType = (typeof TableType)[keyof typeof TableType]

const tableOptions = [
  { value: TableType.CarTypes, label: 'Car Types', addLabel: 'Add Car Type' },
  { value: TableType.CarModels, label: 'Car Models', addLabel: 'Add Car Model' },
  { value: TableType.Brands, label: 'Brands', addLabel: 'Add Brand' },
] as const

export function SettingTable() {
  const [tableType, setTableType] = useState<TableType>(TableType.CarTypes)
  const [createRequest, setCreateRequest] = useState(0)

  const activeOption = tableOptions.find((option) => option.value === tableType)

  return (
    <Stack spacing={2.5}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Tabs
          value={tableType}
          onChange={(_event, value: TableType) => {
            setTableType(value)
            setCreateRequest(0)
          }}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 44,
            width: 'fit-content',
            maxWidth: '100%',
            p: 0.5,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTabs-list': {
              gap: 0.5,
            },
            '& .MuiTab-root': {
              minHeight: 36,
              minWidth: 0,
              px: 2.25,
              py: 0.75,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              letterSpacing: 0,
              color: 'text.secondary',
              transition: 'background-color 0.15s ease, color 0.15s ease',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'action.hover',
              },
              '&.Mui-selected': {
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                fontWeight: 600,
                boxShadow: '0 1px 3px rgba(21, 101, 192, 0.35)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
        >
          {tableOptions.map((option) => (
            <Tab key={option.value} value={option.value} label={option.label} />
          ))}
        </Tabs>

        <Button
          variant="contained"
          onClick={() => setCreateRequest((value) => value + 1)}
        >
          {activeOption?.addLabel}
        </Button>
      </Stack>

      {tableType === TableType.CarTypes ? (
        <CarTypesTable createRequest={createRequest} />
      ) : null}
      {tableType === TableType.CarModels ? (
        <CarModelsTable createRequest={createRequest} />
      ) : null}
      {tableType === TableType.Brands ? (
        <BrandsTable createRequest={createRequest} />
      ) : null}
    </Stack>
  )
}

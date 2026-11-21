import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { ReactNode } from 'react'
import { Typography } from '@/components/ui/Typography/index.tsx'

export type Column<T> = {
  key: string
  header: string
  render?: (row: T, index: number) => ReactNode
  width?: string | number
  align?: 'left' | 'center' | 'right'
  /** Shrink column to content width (good for id / actions). */
  fit?: boolean
}

type DataTableProps<T extends object> = {
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
}

type ColumnLayout = Pick<Column<unknown>, 'key' | 'width' | 'fit'>

function isFitColumn(column: ColumnLayout) {
  if (column.fit != null) return column.fit
  return column.key === 'id' || column.key === 'actions'
}

function cellSx(column: ColumnLayout) {
  const fit = isFitColumn(column)
  return {
    width: column.width ?? (fit ? '1%' : 'auto'),
    whiteSpace: fit ? ('nowrap' as const) : undefined,
    verticalAlign: 'middle' as const,
  }
}

export function DataTable<T extends object>({
  columns,
  rows,
  getRowId,
}: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ tableLayout: 'auto', width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
                sx={{
                  ...cellSx(column),
                  fontWeight: 700,
                  bgcolor: 'action.hover',
                }}
              >
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography variant="body2" color="text.secondary">
                  No records
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={getRowId(row)} hover>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    sx={cellSx(column)}
                  >
                    {column.render
                      ? column.render(row, index)
                      : String(row[column.key as keyof T] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Typography } from '@/components/ui/Typography/index.tsx'

type Column<T> = {
  key: keyof T & string
  header: string
  render?: (row: T) => string
}

type DataTableProps<T extends object> = {
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
}

export function DataTable<T extends object>({
  columns,
  rows,
  getRowId,
}: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.header}</TableCell>
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
            rows.map((row) => (
              <TableRow key={getRowId(row)} hover>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(row)
                      : String(row[column.key])}
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

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
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>No records</td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

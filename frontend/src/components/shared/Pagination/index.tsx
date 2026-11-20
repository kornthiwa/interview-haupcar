import MuiPagination from '@mui/material/Pagination'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  return (
    <MuiPagination
      page={page}
      count={Math.max(pageCount, 1)}
      color="primary"
      shape="rounded"
      onChange={(_, nextPage) => onPageChange(nextPage)}
    />
  )
}

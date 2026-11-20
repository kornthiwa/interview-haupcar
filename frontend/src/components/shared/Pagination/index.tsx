import { Button } from '@/components/ui/Button/index.tsx'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const total = Math.max(pageCount, 1)

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span>
        {page} / {total}
      </span>
      <Button disabled={page >= total} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </nav>
  )
}

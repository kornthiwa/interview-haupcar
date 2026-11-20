import { useMemo, useState } from 'react'
import { useDebouncedValue } from '@/hooks/index.ts'
import { listMedications } from '../services/index.ts'

const pageSize = 10

export function useMedications() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebouncedValue(query)

  const filtered = useMemo(() => {
    const keyword = debouncedQuery.trim().toLowerCase()
    return listMedications().filter((medication) =>
      `${medication.name} ${medication.dosage}`.toLowerCase().includes(keyword),
    )
  }, [debouncedQuery])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize

  function updateQuery(next: string) {
    setQuery(next)
    setPage(1)
  }

  return {
    medications: filtered.slice(start, start + pageSize),
    setQuery: updateQuery,
    page: currentPage,
    pageCount,
    setPage,
  }
}

import { useMemo, useState } from 'react'
import { useDebouncedValue } from '@/hooks/index.ts'
import { listPatients } from '../services/index.ts'

const pageSize = 10

export function usePatients() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebouncedValue(query)

  const filtered = useMemo(() => {
    const keyword = debouncedQuery.trim().toLowerCase()
    return listPatients().filter((patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(keyword),
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
    patients: filtered.slice(start, start + pageSize),
    setQuery: updateQuery,
    page: currentPage,
    pageCount,
    setPage,
  }
}

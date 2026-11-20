import { DataTable } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { SearchForm } from '@/components/shared/SearchForm/index.tsx'
import { useMedications } from '../hooks/index.ts'

export function MedicationPage() {
  const { medications, setQuery, page, pageCount, setPage } = useMedications()

  return (
    <section>
      <h1>Medications</h1>
      <SearchForm onSearch={setQuery} placeholder="Search medications" />
      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'dosage', header: 'Dosage' },
        ]}
        rows={medications}
        getRowId={(medication) => medication.id}
      />
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </section>
  )
}

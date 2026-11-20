import { DataTable } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { SearchForm } from '@/components/shared/SearchForm/index.tsx'
import { usePatients } from '../hooks/index.ts'

export function PatientPage() {
  const { patients, setQuery, page, pageCount, setPage } = usePatients()

  return (
    <section>
      <h1>Patients</h1>
      <SearchForm onSearch={setQuery} placeholder="Search patients" />
      <DataTable
        columns={[
          { key: 'firstName', header: 'First name' },
          { key: 'lastName', header: 'Last name' },
        ]}
        rows={patients}
        getRowId={(patient) => patient.id}
      />
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </section>
  )
}

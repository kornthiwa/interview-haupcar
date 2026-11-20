import { DataTable } from '@/components/shared/DataTable/index.tsx'
import { Pagination } from '@/components/shared/Pagination/index.tsx'
import { SearchForm } from '@/components/shared/SearchForm/index.tsx'
import { formatDateTime } from '@/utils/index.ts'
import { useAppointments } from '../hooks/index.ts'

export function AppointmentPage() {
  const { appointments, setQuery, page, pageCount, setPage } = useAppointments()

  return (
    <section>
      <h1>Appointments</h1>
      <SearchForm onSearch={setQuery} placeholder="Search by patient id" />
      <DataTable
        columns={[
          { key: 'patientId', header: 'Patient' },
          {
            key: 'scheduledAt',
            header: 'Scheduled',
            render: (appointment) => formatDateTime(appointment.scheduledAt),
          },
        ]}
        rows={appointments}
        getRowId={(appointment) => appointment.id}
      />
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </section>
  )
}

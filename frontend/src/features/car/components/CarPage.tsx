import { Typography } from '@/components/ui/Typography/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { CarTable } from './CarTable.tsx'

export function CarPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Cars
      </Typography>
      <CarTable />
    </Stack>
  )
}

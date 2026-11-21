import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { SettingTable } from './SettingTable.tsx'

export function SettingPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Settings
      </Typography>
      <SettingTable />
    </Stack>
  )
}

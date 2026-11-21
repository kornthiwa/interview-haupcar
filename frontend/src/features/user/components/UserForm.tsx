import { Input } from '@/components/ui/Input/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { useUser } from '@/hooks/index.ts'
import { formatDateTime } from '@/utils/index.ts'

export function UserForm() {
  const user = useUser()

  return (
    <Stack spacing={2}>
      <Input label="Name" value={user?.name ?? ''} readOnly />
      <Input label="Username" value={user?.username ?? ''} readOnly />
      <Input
        label="Created At"
        value={user?.createdAt ? formatDateTime(user.createdAt) : ''}
        readOnly
      />
      <Input
        label="Updated At"
        value={user?.updatedAt ? formatDateTime(user.updatedAt) : ''}
        readOnly
      />
    </Stack>
  )
}

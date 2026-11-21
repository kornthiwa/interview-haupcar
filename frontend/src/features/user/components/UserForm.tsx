import { Input } from '@/components/ui/Input/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { formatDateTime } from '@/utils/index.ts'
import type { User } from '../types/index.ts'

type UserFormProps = {
  user: User | null
}

export function UserForm({ user }: UserFormProps) {
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

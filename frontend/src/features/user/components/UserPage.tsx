import { Alert } from '@/components/ui/Alert/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { UserForm } from './UserForm.tsx'
import { useUserProfile } from '../hooks/useUserProfile.ts'

export function UserPage() {
  const { profile, save, isSaving, error } = useUserProfile()

  return (
    <Stack spacing={2} sx={{ maxWidth: 420 }}>
      <Typography variant="h4" component="h1">
        User
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <UserForm profile={profile} isSaving={isSaving} onSubmit={save} />
      {profile ? (
        <Typography variant="body1">
          {profile.name} · {profile.email}
        </Typography>
      ) : null}
    </Stack>
  )
}

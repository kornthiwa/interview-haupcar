import { Box, CircularProgress, Paper } from '@mui/material'
import { Alert } from '@/components/ui/Alert/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useUserProfile } from '../hooks/index.ts'
import { UserForm } from './UserForm.tsx'

export function UserPage() {
  const { user, isLoading, isError } = useUserProfile()

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100svh - 112px)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h4" component="h1">
              Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user ? `Signed in as ${user.username}` : 'Your account details'}
            </Typography>
          </Stack>
          {isLoading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : null}
          {isError ? <Alert severity="error">Failed to load profile</Alert> : null}
          {!isLoading && !isError ? <UserForm user={user} /> : null}
        </Stack>
      </Paper>
    </Box>
  )
}

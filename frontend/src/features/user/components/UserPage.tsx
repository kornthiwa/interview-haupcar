import { Box, Paper } from '@mui/material'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useUser } from '@/hooks/index.ts'
import { UserForm } from './UserForm.tsx'

export function UserPage() {
  const user = useUser()

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
          <UserForm />
        </Stack>
      </Paper>
    </Box>
  )
}

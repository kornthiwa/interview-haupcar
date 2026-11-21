import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { paths } from '@/app/routes/paths.ts'
import { Alert } from '@/components/ui/Alert/index.tsx'
import { Button } from '@/components/ui/Button/index.tsx'
import { Input } from '@/components/ui/Input/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useAuth } from '../hooks/index.ts'
import { loginSchema, type LoginInput } from '../types/index.ts'
import { AuthCard } from './AuthCard.tsx'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const registered = Boolean((location.state as { registered?: boolean } | null)?.registered)
  const { login, isLoggingIn, loginError } = useAuth()
  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  async function onSubmit(values: LoginInput) {
    try {
      await login(values)
      navigate(paths.home, { replace: true })
    } catch {
      // loginError is rendered from the mutation
    }
  }

  async function onAdminLogin() {
    try {
      await login({ username: 'admin', password: 'admin' })
      navigate(paths.home, { replace: true })
    } catch {
      // loginError is rendered from the mutation
    }
  }
  return (
    <AuthCard title="Login" subtitle="Sign in to Haupcar">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {registered ? <Alert severity="success">Account created. Sign in to continue.</Alert> : null}
          {loginError ? <Alert severity="error">{loginError}</Alert> : null}
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Username"
                autoComplete="username"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Password"
                type="password"
                autoComplete="current-password"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Button variant="contained" type="submit" disabled={isLoggingIn}>
            Login
          </Button>
          <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No account yet?
            </Typography>
            <Button variant="text" type="button" onClick={() => navigate(paths.register)}>
              Register
            </Button>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Continue as admin?
            </Typography>
            <Button variant="text" type="button" disabled={isLoggingIn} onClick={onAdminLogin}>
              Login as admin
            </Button>
          </Stack>
        </Stack>
      </form>
    </AuthCard>
  )
}

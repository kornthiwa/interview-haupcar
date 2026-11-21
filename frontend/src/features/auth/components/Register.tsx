import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { paths } from '@/app/routes/paths.ts'
import { Alert } from '@/components/ui/Alert/index.tsx'
import { Button } from '@/components/ui/Button/index.tsx'
import { Input } from '@/components/ui/Input/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useAuth } from '../hooks/index.ts'
import { registerSchema, type RegisterInput } from '../types/index.ts'
import { AuthCard } from './AuthCard.tsx'

export function Register() {
  const navigate = useNavigate()
  const { register, isRegistering, registerError } = useAuth()
  const { control, handleSubmit } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', username: '', password: '' },
  })

  async function onSubmit(values: RegisterInput) {
    try {
      await register(values)
      navigate(paths.login, { replace: true, state: { registered: true } })
    } catch {
      // registerError is rendered from the mutation
    }
  }

  return (
    <AuthCard title="Register" subtitle="Create a Haupcar account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {registerError ? <Alert severity="error">{registerError}</Alert> : null}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Name"
                autoComplete="name"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
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
                autoComplete="new-password"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Button variant="contained" type="submit" disabled={isRegistering}>
            Create account
          </Button>
          <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <Button variant="text" type="button" onClick={() => navigate(paths.login)}>
              Login
            </Button>
          </Stack>
        </Stack>
      </form>
    </AuthCard>
  )
}

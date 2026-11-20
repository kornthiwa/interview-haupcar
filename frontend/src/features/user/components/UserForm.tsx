import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button/index.tsx'
import { Input } from '@/components/ui/Input/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { userSchema, type UserFormValues } from '../schema.ts'

type UserFormProps = {
  profile: UserFormValues | null
  isSaving: boolean
  onSubmit: (values: UserFormValues) => void
}

const emptyValues: UserFormValues = { name: '', email: '' }

export function UserForm({ profile, isSaving, onSubmit }: UserFormProps) {
  const { control, handleSubmit, reset } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: profile ?? emptyValues,
  })

  useEffect(() => {
    if (profile) reset(profile)
  }, [profile, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Name"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Email"
              type="email"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={isSaving}>
          Save
        </Button>
      </Stack>
    </form>
  )
}

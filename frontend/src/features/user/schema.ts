import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Enter a valid email'),
})

export type UserFormValues = z.infer<typeof userSchema>

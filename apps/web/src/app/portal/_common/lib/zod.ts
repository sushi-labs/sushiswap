import { z } from 'zod'

export const zPassword = z
  .string()
  .min(8, { message: 'Minimum password length is 8 characters.' })
  .max(64, { message: 'Maximum password length is 64 characters.' })
  .regex(/[a-z]/, {
    message: 'Use at least one lowercase letter.',
  })
  .regex(/[A-Z]/, {
    message: 'Use at least one uppercase letter.',
  })
  .regex(/[0-9]/, { message: 'Use at least one digit.' })

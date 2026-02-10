import * as z from 'zod'

export const verifyEmailFormSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .length(6, { message: 'Code must be 6 characters long' }),
})

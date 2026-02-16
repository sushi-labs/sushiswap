import * as z from 'zod'

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
})

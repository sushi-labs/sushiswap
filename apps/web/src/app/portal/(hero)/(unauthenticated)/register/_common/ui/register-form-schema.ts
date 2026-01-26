import { zPassword } from 'src/app/portal/_common/lib/zod'
import * as z from 'zod'

export const registerFormSchema = z
  .object({
    email: z.string().email(),
    password: zPassword,
    passwordConfirmation: zPassword,
  })
  .superRefine((data, ctx) => {
    if (
      data.password &&
      data.passwordConfirmation &&
      data.password !== data.passwordConfirmation
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
      })
    }
  })

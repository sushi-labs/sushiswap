import { zPassword } from 'src/app/portal/_common/lib/zod'
import { z } from 'zod'

export const changeOrCreatePasswordSchema = z
  .object({
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

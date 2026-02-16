import * as z from 'zod'
import { zPassword } from '../../../../../_common/lib/zod'

export const resetPasswordFormSchema = z
  .object({
    userId: z.string().min(1),
    code: z.string().length(6),
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

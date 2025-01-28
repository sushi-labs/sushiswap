import { z } from 'zod'
import { zPassword } from '../../../_common/lib/types'

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: zPassword,
})

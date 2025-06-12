import { z } from 'zod'
import { zPassword } from '../../../../../_common/lib/zod'

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: zPassword,
})

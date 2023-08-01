import { amountSchema } from '@sushiswap/currency'
import z from 'zod'

import { Fee } from '@sushiswap/base-sdk'

export const constantPoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
  fee: z.nativeEnum(Fee),
  twap: z.boolean(),
})

export type SerializedConstantPool = z.infer<typeof constantPoolSchema>

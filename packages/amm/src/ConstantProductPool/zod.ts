import { amountSchema } from '@sushiswap/currency'
import z from 'zod'

import { Fee } from '../Fee'

export const constantProductPoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
  fee: z.nativeEnum(Fee),
  twap: z.boolean(),
})

export type SerializedConstantProductPool = z.infer<typeof constantProductPoolSchema>

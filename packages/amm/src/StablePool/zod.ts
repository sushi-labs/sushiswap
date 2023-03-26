import { amountSchema } from '@sushiswap/currency'
import z from 'zod'

import { Fee } from '../Fee'

export const stablePoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
  fee: z.nativeEnum(Fee),
  total0: z.object({
    base: z.string(),
    elastic: z.string(),
  }),
  total1: z.object({
    base: z.string(),
    elastic: z.string(),
  }),
})

export type SerializedStablePool = z.infer<typeof stablePoolSchema>

import { amountSchema } from '@sushiswap/currency'
import z from 'zod'

export const pairSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
})

export type SerializedPair = z.infer<typeof pairSchema>

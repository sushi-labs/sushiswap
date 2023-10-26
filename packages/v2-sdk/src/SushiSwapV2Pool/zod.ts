import { amountSchema } from 'sushi/currency'
import z from 'zod'

export const sushiSwapV2PoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
})

export type SerializedSushiSwapV2Pool = z.infer<typeof sushiSwapV2PoolSchema>

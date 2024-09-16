import { RouterLiquiditySource } from 'sushi/router'
import { Address } from 'viem'
import z from 'zod'

const booleanSchema = z.preprocess((value) => {
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}, z.boolean())

export const querySchema3_2 = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amount: z.string().transform((amount) => BigInt(amount)),
  gasPrice: z.optional(
    z.coerce
      .number()
      .int('gasPrice should be integer')
      .gt(0, 'gasPrice should be positive'),
  ),
  source: z.optional(z.nativeEnum(RouterLiquiditySource)),
  to: z
    .optional(z.string())
    .transform((to) => (to ? (to as Address) : undefined)),
  preferSushi: z.optional(booleanSchema).default(false),
  maxPriceImpact: z.optional(
    z.coerce
      .number()
      .lt(1, 'maxPriceImpact should be lesser than 1')
      .gt(0, 'maxPriceImpact should be positive'),
  ),
})

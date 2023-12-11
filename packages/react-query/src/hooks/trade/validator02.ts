import z from 'zod'

const tokenValidator = z.object({
  address: z.string().optional(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number().optional(),
})

export const legValidator = z.object({
  poolAddress: z.string(),
  poolType: z.string(),
  poolName: z.string(),
  poolFee: z.number(),
  tokenFrom: tokenValidator,
  tokenTo: tokenValidator,
  share: z.number(),
  assumedAmountIn: z.string(),
  assumedAmountOut: z.string(),
})

export const tradeValidator02 = z.object({
  route: z
    .object({
      status: z.string(),
      tokenFrom: tokenValidator,
      tokenTo: tokenValidator,
      primaryPrice: z.number().optional(),
      swapPrice: z.number().optional(),
      priceImpact: z.number().optional(),
      amountIn: z.string(),
      assumedAmountOut: z.string(),
      legs: z.array(legValidator).optional(),
      gasSpent: z.number(),
      totalAmountOut: z.string(),
    })
    .optional(),
  args: z.optional(
    z.object({
      amountIn: z.string(),
      amountOutMin: z.string(),
      to: z.string(),
      tokenIn: z.string(),
      tokenOut: z.string(),
      routeCode: z.string(),
    }),
  ),
})

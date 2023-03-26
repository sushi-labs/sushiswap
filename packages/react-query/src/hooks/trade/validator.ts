import z from 'zod'

const tokenValidator = z.object({
  chainId: z.number().or(z.string()),
  decimals: z.number().optional(),
  symbol: z.string(),
  name: z.string(),
  isNative: z.boolean().optional(),
  isToken: z.boolean().optional(),
  address: z.string().optional(),
  tokenId: z.string().optional(),
})

export const legValidator = z.object({
    poolAddress: z.string(),
    poolType: z.enum(['Classic', 'Stable', 'Unknown']),
    poolFee: z.number(),
    tokenFrom: tokenValidator,
    tokenTo: tokenValidator,
    assumedAmountIn: z.number(),
    assumedAmountOut: z.number(),
    swapPortion: z.number(),
    absolutePortion: z.number(),
    poolName: z.string()
})

export const tradeValidator = z.object({
  route: z.object({
    status: z.string(),
    fromToken: tokenValidator,
    toToken: tokenValidator,
    primaryPrice: z.number(),
    swapPrice: z.number(),
    priceImpact: z.number(),
    amountIn: z.number(),
    amountInBN: z.string(),
    amountOut: z.number(),
    amountOutBN: z.string(),
    legs: z
      .array(legValidator)
      .optional(),
    gasSpent: z.number(),
    totalAmountOut: z.number(),
    totalAmountOutBN: z.string(),
  }).optional(),
  args: z.optional(
    z.object({
      amountIn: z.object({
        type: z.string(),
        hex: z.string(),
      }),
      amountOutMin: z.object({
        type: z.string(),
        hex: z.string(),
      }),
      to: z.string(),
      tokenIn: z.string(),
      tokenOut: z.string(),
      routeCode: z.string(),
    })
  ),
})

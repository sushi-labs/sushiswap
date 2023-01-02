import z from 'zod'

const tokenValidator = z.object({
  chainId: z.number(),
  decimals: z.number(),
  symbol: z.string(),
  name: z.string(),
  rebase: z
    .object({
      base: z.array(z.number()),
      elastic: z.array(z.number()),
    })
    .optional(),
  isNative: z.boolean(),
  isToken: z.boolean(),
  address: z.string(),
  tokenId: z.string(),
})

export const tradeValidator = z.object({
  getCurrentRouteHumanString: z.string(),
  getCurrentRouteHumanArray: z.array(z.string()),
  getBestRoute: z.object({
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
      .array(
        z.object({
          poolAddress: z.string(),
          poolType: z.enum(['Classic']),
          poolFee: z.number(),
          tokenFrom: tokenValidator,
          tokenTo: tokenValidator,
          assumedAmountIn: z.number(),
          assumedAmountOut: z.number(),
          swapPortion: z.number(),
          absolutePortion: z.number(),
        })
      )
      .optional(),
    gasSpent: z.number(),
    totalAmountOut: z.number(),
    totalAmountOutBN: z.string(),
  }),
})

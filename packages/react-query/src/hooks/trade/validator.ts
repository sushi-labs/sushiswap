import z from 'zod'

const tokenValidator = z.object({
  chainId: z.number(),
  decimals: z.number().optional(),
  symbol: z.string(),
  name: z.string(),
  isNative: z.boolean().optional(),
  isToken: z.boolean().optional(),
  address: z.string().optional(),
  tokenId: z.string().optional(),
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
  getCurrentRouteRPParams: z.optional(
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

import z from 'zod'

const tokenValidator = z.object({
  address: z.string(), // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE if native
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

export const legValidator = z.object({
  poolAddress: z.string(),
  poolType: z.string(),
  poolName: z.string(),
  poolFee: z.number(),
  tokenFrom: z.number(), // index in tokens array
  tokenTo: z.number(), // index in tokens array
  share: z.number(),
  assumedAmountIn: z.string(),
  assumedAmountOut: z.string(),
})

const routeExistValidator = z.object({
  status: z.enum(['Success', 'Partial']),
  tokens: z.array(tokenValidator),
  tokenFrom: z.number(), // index in tokens array
  tokenTo: z.number(), // index in tokens array

  primaryPrice: z.number(),
  swapPrice: z.number(),
  priceImpact: z.number(),

  amountIn: z.string(),
  amountOutMin: z.string(),
  assumedAmountOut: z.string(),
  gasSpent: z.number(),

  legs: z.array(legValidator),

  routeProcessorAddr: z.string(),
  routeProcessorArgs: z.object({
    tokenIn: z.string(),
    amountIn: z.string(),
    tokenOut: z.string(),
    amountOutMin: z.string(),
    to: z.string(),
    routeCode: z.string(),
  }),
})

const routeDontExistValidator = z.object({
  status: z.enum(['NoWay']),
})

export const tradeValidator02 = z.object({
  route: z.union([routeExistValidator, routeDontExistValidator]),
})

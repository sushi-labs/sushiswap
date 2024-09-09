import { isAddressFast } from 'sushi/serializer'
import { PoolType } from 'sushi/tines'
import { Address } from 'viem'
import z from 'zod'

export const tokenValidator = z.object({
  address: z.string(), // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE if native
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

export const legValidator = z.object({
  poolAddress: z.string(),
  poolType: z.nativeEnum(PoolType),
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

  primaryPrice: z.number().optional(), // only if debug
  swapPrice: z.number(),
  priceImpact: z.number(),

  amountIn: z.string(),
  assumedAmountOut: z.string(),
  gasSpent: z.number(),

  route: z.array(legValidator),

  routeProcessorAddr: z.string().optional(),
  routeProcessorArgs: z
    .object({
      tokenIn: z.string(),
      amountIn: z.string(),
      tokenOut: z.string(),
      amountOutMin: z.string(),
      to: z.string(),
      routeCode: z.string(),
      value: z.string().optional(),
    })
    .optional(),

  tx: z.optional(
    z.object({
      from: z.custom<Address>(
        (val) => isAddressFast(val),
        (val) => ({ message: `Incorrect address for 'from': ${val}` }),
      ),
      to: z.custom<Address>(
        (val) => isAddressFast(val),
        (val) => ({ message: `Incorrect address for 'to': ${val}` }),
      ),
      data: z.string(),
      value: z.coerce.bigint().optional(),
    }),
  ),
})

const routeDontExistValidator = z.object({
  status: z.enum(['NoWay']),
})

export const tradeValidator02 = z.union([
  routeExistValidator,
  routeDontExistValidator,
])

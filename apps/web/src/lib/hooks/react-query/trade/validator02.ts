import { sz } from 'sushi'
import { PoolType, isEvmAddress } from 'sushi/evm'
import type { Address } from 'viem'
import z from 'zod'

export const tokenValidator = z.object({
  address: z.string(), // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE if native
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

export const legValidator = z.object({
  poolType: z.nativeEnum(PoolType),
  poolName: z.string(),
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
      from: sz.evm.address(),
      to: sz.evm.address(),
      gas: z.string().optional(),
      gasPrice: z.number().optional(),
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

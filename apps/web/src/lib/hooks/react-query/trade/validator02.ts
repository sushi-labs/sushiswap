import { isAddressFast } from 'sushi/validate'
import type { Address } from 'viem'
import z from 'zod'
import { visualizationValidator } from './validator01'

export const tokenValidator = z.object({
  address: z.string(), // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE if native
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
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
      from: z.custom<Address>(
        (val) => isAddressFast(val),
        (val) => ({ message: `Incorrect address for 'from': ${val}` }),
      ),
      to: z.custom<Address>(
        (val) => isAddressFast(val),
        (val) => ({ message: `Incorrect address for 'to': ${val}` }),
      ),
      gas: z.string().optional(),
      gasPrice: z.number().optional(),
      data: z.string(),
      value: z.coerce.bigint().optional(),
    }),
  ),

  vizualization: visualizationValidator,
})

const routeDontExistValidator = z.object({
  status: z.enum(['NoWay']),
})

export const tradeValidator02 = z.union([
  routeExistValidator,
  routeDontExistValidator,
])

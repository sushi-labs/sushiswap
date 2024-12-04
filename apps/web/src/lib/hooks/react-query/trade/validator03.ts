import { isAddressFast } from 'sushi/validate'
import { Address } from 'viem'
import z from 'zod'

export const tokenValidator = z.object({
  address: z.string(), // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE if native
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

export const routeValidator = z.object({
  liquidityProviders: z.array(z.string()).nonempty(),
  nodes: z.array(
    z.object({
      address: z.string().min(1),
      symbol: z.string().min(1),
      name: z.string().min(1),
      decimals: z.number().int(),
    })
  ).nonempty(),
  links: z.array(
    z.object({
      source: z.number().int(),
      target: z.number().int(),
      liquidityProvider: z.number().int(),
      amountIn: z.number(),
      amountOut: z.number(),
      value: z.number(),
    })
  ).nonempty(),
}).optional();

// const routeExistValidator = z.object({
export const tradeValidator03 = z.object({
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
  route: routeValidator,
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

// const routeDontExistValidator = z.object({
//   status: z.enum(['NoWay']),
// })

// export const tradeValidator03 = z.union([
//   routeExistValidator,
//   routeDontExistValidator,
// ])

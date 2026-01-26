import { sz } from 'sushi'
import { isEvmAddress } from 'sushi/evm'
import type { Address } from 'viem'
import * as z from 'zod'

export const tokenValidator = z.object({
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
  poolType: z.enum(['Classic', 'Stable', 'Unknown']),
  tokenFrom: tokenValidator,
  tokenTo: tokenValidator,
  assumedAmountIn: z.number(),
  assumedAmountOut: z.number(),
  swapPortion: z.number(),
  absolutePortion: z.number(),
  poolName: z.string(),
})

export const tradeValidator01 = z.object({
  route: z
    .object({
      status: z.string(),
      fromToken: tokenValidator,
      toToken: tokenValidator,
      primaryPrice: z.number().optional(),
      swapPrice: z.number().optional(),
      priceImpact: z.number().optional(),
      amountIn: z.number(),
      amountInBI: z.bigint(),
      amountOut: z.number(),
      amountOutBI: z.bigint(),
      gasSpent: z.number(),
      totalAmountOut: z.number(),
      totalAmountOutBI: z.bigint(),
    })
    .optional(),
  args: z.optional(
    z.object({
      amountIn: z.bigint(),
      amountOutMin: z.bigint(),
      to: z.string(),
      tokenIn: z.string(),
      tokenOut: z.string(),
      routeCode: z.string(),
    }),
  ),
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

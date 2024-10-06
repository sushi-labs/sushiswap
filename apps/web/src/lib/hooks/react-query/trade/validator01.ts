import { isAddressFast } from 'sushi/validate'
import type { Address } from 'viem'
import z from 'zod'

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

const linkValidator = z.object({
  source: z.number(),
  target: z.number(),
  liquidityProvider: z.number(),
  amountIn: z.string(),
  amountOut: z.string(),
  value: z.number(),
})

const nodeValidator = z.object({
  address: z.string(), // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE if native
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
})

export const visualizationValidator = z.object({
  liquidityProviders: z.array(z.string()),
  nodes: z.array(nodeValidator),
  links: z.array(linkValidator),
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

  vizualization: z.optional(visualizationValidator),
})

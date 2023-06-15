import { z } from 'zod'
// import { ChainId } from '@sushiswap/chain'
import { SwapChainId } from '../../types'
// import { isUniswapV2FactoryChainId } from '@sushiswap/v2-core'
// import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident-core'

export const queryParamsSchema = z.object({
  fromChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .optional()
    .transform((chainId) => chainId as SwapChainId | undefined),
  // .refine(
  //   (chainId) =>
  //     isUniswapV2FactoryChainId(chainId) ||
  //     isConstantProductPoolFactoryChainId(chainId) ||
  //     isStablePoolFactoryChainId(chainId),
  //   {
  //     message: 'ChainId not supported.',
  //   }
  // ),
  // fromCurrency: z
  //   .string()
  //   .nullable()
  //   .transform((arg) => (arg ? arg : 'NATIVE')),
  fromCurrency: z.optional(z.nullable(z.string())).transform((val) => val ?? 'NATIVE'),
  toChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .optional()
    .transform((chainId) => chainId as SwapChainId | undefined),
  toCurrency: z.optional(z.nullable(z.string())).transform((val) => val ?? 'SUSHI'),
  // toCurrency: z
  //   .string()
  //   .nullable()
  //   .transform((arg) => (arg ? arg : 'SUSHI')),
  amount: z.optional(z.nullable(z.string())).transform((val) => val ?? ''),
  recipient: z.optional(z.nullable(z.string())),
  review: z.optional(z.nullable(z.boolean())),
})

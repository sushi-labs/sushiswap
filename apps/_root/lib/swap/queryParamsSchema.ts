import { z } from 'zod'
import { ChainId } from '@sushiswap/chain'
import { SwapChainId } from '../types'
import { isUniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident'

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
  fromCurrency: z.string().default('NATIVE'),
  toChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .optional()
    .transform((chainId) => chainId as SwapChainId | undefined),
  toCurrency: z.string().default('SUSHI'),
  amount: z.string().default(''),
  recipient: z.optional(z.coerce.string()),
  review: z.optional(z.coerce.boolean()),
})

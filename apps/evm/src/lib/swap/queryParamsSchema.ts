import { Address, isAddress } from 'viem'
import { z } from 'zod'

import { SwapChainId } from '../../types'

export const queryParamsSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .optional()
    .transform((chainId) => chainId as SwapChainId | undefined),
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
  fromCurrency: z
    .nullable(z.string())
    .transform((currency) =>
      typeof currency === 'string' ? currency : 'NATIVE',
    ),
  toChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .optional()
    .transform((chainId) => chainId as SwapChainId | undefined),
  toCurrency: z
    .nullable(z.string())
    .transform((currency) => (typeof currency === 'string' ? currency : '')),
  // .transform((currency) => (typeof currency === 'string' ? currency : 'NATIVE')),
  // toCurrency: z
  //   .string()
  //   .nullable()
  //   .transform((arg) => (arg ? arg : 'SUSHI')),
  amount: z.optional(z.nullable(z.string())).transform((val) => val ?? ''),
  recipient: z.optional(
    z
      .nullable(z.string())
      .transform((val) => (val && isAddress(val) ? (val as Address) : null)),
  ),
  review: z.optional(z.nullable(z.boolean())),
})
// .transform((val) => ({
//   ...val,
//   toCurrency: defaultQuoteCurrency[val.fromChainId].wrapped.address,
// }))

import { RouterLiquiditySource } from '@sushiswap/router'
import { ChainId } from 'sushi/chain'
import {
  ExtractorSupportedChainId,
  RouteProcessor3ChainId,
  RouteProcessor3_1ChainId,
  RouteProcessor3_2ChainId,
  RouteProcessor4ChainId,
  isExtractorSupportedChainId,
  isRouteProcessor3ChainId,
  isRouteProcessor3_1ChainId,
  isRouteProcessor3_2ChainId,
  isRouteProcessor4ChainId,
} from 'sushi/config'
import { Address, isAddress } from 'viem'
import z from 'zod'
export const zChainId = z.coerce
  .number()
  .int()
  .gte(0)
  .lte(2 ** 256)
  .default(ChainId.ETHEREUM)

export const poolCodesForTokenSchema = z.object({
  chainId: zChainId
    .refine((chainId) => isExtractorSupportedChainId(chainId), {
      message: 'ChainId not supported.',
    })
    .transform((chainId) => chainId as ExtractorSupportedChainId),
  address: z.coerce.string().refine(isAddress, {
    message: 'Address is not checksummed.',
  }),
})

export const querySchema3 = z.object({
  chainId: zChainId
    .refine(
      (chainId) =>
        isRouteProcessor3ChainId(chainId as RouteProcessor3ChainId) &&
        isExtractorSupportedChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as RouteProcessor3ChainId),
  tokenIn: z.string(),
  tokenOut: z.string(),
  amount: z.string().transform((amount) => BigInt(amount)),
  gasPrice: z.optional(z.coerce.number().int().gt(0)),
  source: z.optional(z.nativeEnum(RouterLiquiditySource)),
  to: z
    .optional(z.string())
    .transform((to) => (to ? (to as Address) : undefined)),
  preferSushi: z.optional(z.coerce.boolean()),
  maxPriceImpact: z.optional(z.coerce.number()),
})

export const querySchema3_1 = querySchema3.extend({
  chainId: zChainId
    .refine(
      (chainId) =>
        isRouteProcessor3_1ChainId(chainId as RouteProcessor3_1ChainId) &&
        isExtractorSupportedChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as RouteProcessor3_1ChainId),
})

export const querySchema3_2 = querySchema3.extend({
  chainId: zChainId
    .refine(
      (chainId) =>
        isRouteProcessor3_2ChainId(chainId as RouteProcessor3_2ChainId) &&
        isExtractorSupportedChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as Exclude<RouteProcessor3_2ChainId, 314>),
})

export const querySchema4 = querySchema3.extend({
  chainId: zChainId
    .refine(
      (chainId) =>
        isRouteProcessor4ChainId(chainId as RouteProcessor4ChainId) &&
        isExtractorSupportedChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as RouteProcessor4ChainId),
})

import { ChainId } from 'sushi/chain'
import {
  RouteProcessor3_2ChainId,
  isExtractorSupportedChainId,
  isRouteProcessor3_2ChainId,
} from 'sushi/config'
import { RouterLiquiditySource } from 'sushi/router'
import { Address } from 'viem'
import z from 'zod'

export const zChainId = z.coerce
  .number()
  .int()
  .gte(0)
  .lte(2 ** 256)
  .default(ChainId.ETHEREUM)

export const querySchema3_2 = z.object({
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

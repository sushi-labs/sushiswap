import {
  type AuctionType,
  AuctionTypes,
  BONDS_ENABLED_CHAIN_IDS,
  getChainIdAuctioneerMarketFromMarketId,
  isBondChainId,
} from '@sushiswap/bonds-sdk'
import type { ChainId } from 'sushi/chain'
import { z } from 'zod'

export const BondsApiSchema = z.object({
  take: z.coerce.number().int().lte(1000).default(1000),
  ids: z
    .string()
    .transform((ids) =>
      ids
        ?.split(',')
        .map((id) => getChainIdAuctioneerMarketFromMarketId(id.toLowerCase())),
    )
    .optional(),
  chainIds: z
    .string()
    .optional()
    .default(BONDS_ENABLED_CHAIN_IDS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v) as ChainId))
    .transform((chainIds) => chainIds.filter(isBondChainId)),
  issuerIds: z
    .string()
    .transform((ids) => ids?.split(',').map((id) => id.toLowerCase()))
    .optional(),
  onlyOpen: z.coerce
    .string()
    .optional()
    .default('true')
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('onlyOpen must true or false')
      }
    }),
  onlyDiscounted: z.coerce
    .string()
    .optional()
    .default('false')
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('onlyDiscounted must true or false')
      }
    }),
  auctionTypes: z
    .string()
    .optional()
    .default(AuctionTypes.join(','))
    .transform((types) =>
      types?.split(',').map((type) => {
        if (!AuctionTypes.includes(type as AuctionType)) {
          throw new Error(
            `Invalid auction type ${type}, valid options are ${AuctionTypes.join(
              ', ',
            )}`,
          )
        }

        return type as AuctionType
      }),
    ),
  orderBy: z.string().default('discount'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

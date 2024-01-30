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
  issuerNames: z
    .string()
    .transform((names) => names?.split(','))
    .optional(),
  anyIssuer: z.coerce
    .string()
    .optional()
    .default('false')
    .transform((val) => {
      switch (val) {
        case 'true':
          return true
        case 'false':
          return false
        default:
          throw new Error('anyIssuer must true or false')
      }
    }),
  onlyOpen: z.coerce
    .string()
    .optional()
    .default('true')
    .transform((val) => {
      switch (val) {
        case 'true':
          return true
        case 'false':
          return false
        default:
          throw new Error('onlyOpen must true or false')
      }
    }),
  onlyDiscounted: z.coerce
    .string()
    .optional()
    .default('false')
    .transform((val) => {
      switch (val) {
        case 'true':
          return true
        case 'false':
          return false
        default:
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

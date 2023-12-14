import {
  AuctionType,
  BONDS_ENABLED_CHAIN_IDS,
  getChainIdAuctioneerMarketFromMarketId,
  isBondChainId,
} from '@sushiswap/bonds-sdk'
import type { ChainId } from 'sushi/chain'
import { z } from 'zod'

const auctionTypes: Record<keyof typeof AuctionType, string> = {
  Dynamic: 'dynamic',
  Static: 'static',
}

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
  isOpen: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('isOpen must true or false')
      }
    })
    .optional(),
  issuerIds: z
    .string()
    .transform((ids) => ids?.split(',').map((id) => id.toLowerCase()))
    .optional(),
  isDiscounted: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('isDiscounted must true or false')
      }
    })
    .optional(),
  auctionTypes: z
    .string()
    .transform((types) =>
      types?.split(',').map((type) => {
        const auctionType =
          AuctionType[type.toLowerCase() as keyof typeof AuctionType]

        if (!auctionType) {
          throw new Error(
            `Invalid auction type ${auctionType}, valid options are ${Object.keys(
              AuctionType,
            ).join(', ')}`,
          )
        }

        return auctionTypes[auctionType]
      }),
    )
    .optional(),
  orderBy: z.string().default('discount'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

import {
  AuctionType,
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
    .refine((val) => ['true', 'false'].includes(val), {
      message: 'anyIssuer must true or false',
    })
    .transform((val) => val === 'true'),
  onlyOpen: z.coerce
    .string()
    .optional()
    .default('true')
    .refine((val) => ['true', 'false'].includes(val), {
      message: 'onlyOpen must true or false',
    })
    .transform((val) => val === 'true'),
  onlyDiscounted: z.coerce
    .string()
    .optional()
    .default('false')
    .refine((val) => ['true', 'false'].includes(val), {
      message: 'onlyDiscounted must true or false',
    })
    .transform((val) => val === 'true'),
  auctionTypes: z
    .string()
    .optional()
    .default(AuctionTypes.join(','))
    .transform((types) => types?.split(','))
    .refine(
      (types) =>
        types.every((type) => AuctionTypes.includes(type as AuctionType)),
      {
        message: `Invalid auction types, valid options are: ${AuctionTypes.join(
          ', ',
        )}`,
      },
    )
    .transform((types) => types as AuctionType[]),
  orderBy: z.string().default('discount'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

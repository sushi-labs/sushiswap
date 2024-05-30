import {
  FURO_SUPPORTED_CHAIN_IDS,
  isFuroChainId,
} from 'node_modules/sushi/dist/config/furo'
import { ChainId } from 'sushi/chain'
import { BENTOBOX_SUPPORTED_CHAIN_IDS, isBentoBoxChainId } from 'sushi/config'
import { z } from 'zod'

export const bentoBoxTokensSchema = z.object({
  tokenSymbols: z
    .nullable(z.string())
    .optional()
    .transform((val) => val?.split(',')),
  chainIds: z
    .string()
    .optional()
    .default(BENTOBOX_SUPPORTED_CHAIN_IDS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v) as ChainId))
    .transform((chainIds) => chainIds.filter(isBentoBoxChainId)),
})

export const furoTokensSchema = z.object({
  // first: z.coerce.number().default(20),
  // skip: z.coerce.number().default(0),
  tokenSymbols: z
    .nullable(z.string())
    .optional()
    .transform((val) => val?.split(',')),
  // orderBy: z.string().default('liquidityUSD'),
  // orderDirection: z.string().default('desc'),
  chainIds: z
    .string()
    .optional()
    .default(FURO_SUPPORTED_CHAIN_IDS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v) as ChainId))
    .transform((chainIds) => chainIds.filter(isFuroChainId)),
})

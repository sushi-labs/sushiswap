import { BENTOBOX_ENABLED_NETWORKS, FURO_ENABLED_NETWORKS } from '@sushiswap/graph-config'
import { z } from 'zod'

export const bentoBoxTokensSchema = z.object({
  tokenSymbols: z
    .nullable(z.string())
    .optional()
    .transform((val) => val?.split(',')),
  chainIds: z
    .string()
    .optional()
    .default(BENTOBOX_ENABLED_NETWORKS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v))),
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
    .default(FURO_ENABLED_NETWORKS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v))),
})

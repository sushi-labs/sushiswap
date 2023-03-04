import type { PoolType } from '@sushiswap/database'
import { z } from 'zod'

export const AggregatorTopPools = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  protocol: z.string(),
  version: z.string(),
  poolTypes: z.string().transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
  take: z.coerce.number().int().gte(0).lte(1000),
  minLiquidity: z.coerce.number().int().optional(),
})

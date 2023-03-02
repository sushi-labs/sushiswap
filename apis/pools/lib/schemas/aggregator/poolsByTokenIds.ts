import type { PoolType } from '@sushiswap/database'
import { z } from 'zod'

export const AggregatorPoolsByTokenIdsSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  protocol: z.string(),
  version: z.string(),
  poolTypes: z.string().transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
  token0: z.string().transform((s) => s.toLowerCase()),
  token1: z.string().transform((s) => s.toLowerCase()),
  size: z.coerce.number().int().gte(0).lte(1000),
  excludeTopPoolsSize: z.coerce.number().int().gte(0).lte(1000),
  topPoolMinLiquidity: z.coerce.number().int().optional(),
})

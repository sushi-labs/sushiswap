// import type { PoolType, PoolVersion } from '@sushiswap/database'
import { z } from 'zod'

export const protocolFilterTypes = ['SUSHISWAP_V3', 'SUSHISWAP_V2', 'BENTOBOX_STABLE', 'BENTOBOX_CLASSIC']

export const PoolsApiSchema = z.object({
  take: z.coerce.number().int().lte(1000).default(20),
  ids: z
    .string()
    .transform((ids) => ids?.split(',').map((id) => id.toLowerCase()))
    .optional(),
  chainIds: z
    .string()
    .transform((val) => val.split(',').map((v) => parseInt(v)))
    .optional(),
  isIncentivized: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('isIncentivized must true or false')
      }
    })
    .optional(),
  isWhitelisted: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('isWhitelisted must true or false')
      }
    })
    .optional(),
  tokenSymbols: z
    .string()
    .transform((tokenSymbols) => tokenSymbols?.split(','))
    .refine((tokenSymbols) => tokenSymbols.length <= 3, { message: 'Can only use up to 3 tokenSymbols.' })
    .optional(),
  protocols: z
    .string()
    .transform((filter) => {
      if (!filter) return []
      const filters = filter?.split(',')
      return filters?.map((f) => {
        if (!protocolFilterTypes.includes(f)) {
          throw new Error('Invalid filter')
        }
        return f
      })
    })
    .default(''),
  cursor: z.string().optional(),
  orderBy: z.string().default('liquidityUSD'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

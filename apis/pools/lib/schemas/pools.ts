import * as Database from '@sushiswap/database' // Unused as a regular import, but type is being used for casting
import { z } from 'zod'

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
  hasEnabledSteerVault: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('hasEnabledSteerVault must true or false')
      }
    })
    .optional(),
  tokenSymbols: z
    .string()
    .transform((tokenSymbols) => tokenSymbols?.split(','))
    .refine((tokenSymbols) => tokenSymbols.length <= 3, {
      message: 'Can only use up to 3 tokenSymbols.',
    })
    .optional(),
  protocols: z
    .string()
    .transform((protocols) => protocols?.split(',') as Database.Protocol[])
    .optional(),
  cursor: z.string().optional(),
  orderBy: z.string().default('liquidityUSD'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import type { PoolType } from '../../lib'
import { getPools } from '../../lib/api'

export const schema = z.object({
  take: z.number().default(20),
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
  poolTypes: z
    .string()
    .optional()
    .transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
  cursor: z.string().optional(),
  orderBy: z.string().default('liquidityUSD'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

export type PoolsApiSchema = typeof schema._type

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const result = schema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { take, ids, chainIds, isIncentivized, isWhitelisted, poolTypes, cursor, orderBy, orderDir } = result.data
  const pools = await getPools({
    take,
    ids,
    chainIds,
    isIncentivized,
    isWhitelisted,
    poolTypes,
    cursor,
    orderBy,
    orderDir,
  })
  return response.status(200).json(pools)
}

export default handler

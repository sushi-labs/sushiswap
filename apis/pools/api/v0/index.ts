import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import type { PoolType } from '../../lib'
import { getPools } from '../../lib/api'

const schema = z.object({
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
  poolTypes: z.coerce
    .string()
    .transform((val) => val.split(',').map((v) => v as PoolType))
    .optional(),
  cursor: z.string().optional(),
  orderBy: z.string().default('liquidityUSD'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const { chainIds, isIncentivized, poolTypes, cursor, orderBy, orderDir } = schema.parse(_request.query)
  // If parsing fails, should return 400

  const pools = await getPools({ chainIds, isIncentivized, poolTypes, cursor, orderBy, orderDir })
  return response.status(200).json(pools)
}

export default handler

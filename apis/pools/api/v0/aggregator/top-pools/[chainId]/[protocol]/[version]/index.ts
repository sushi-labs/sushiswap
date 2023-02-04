import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import type { PoolType } from '../../../../../../../lib'
import { getAggregatorTopPools } from '../../../../../../../lib/api'

// import { PoolType } from '../../lib'
// import { getEarnPools } from '../../lib/api'
const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  protocol: z.string(),
  version: z.string(),
  poolTypes: z
    .string()
    .transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
  size: z.coerce.number().int().gte(0).lte(1000),
  minLiquidity: z.coerce.number().int().optional(),
})

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const result = schema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId, protocol, version, poolTypes, size, minLiquidity } = result.data

  const pools = await getAggregatorTopPools(chainId, protocol, version, poolTypes, size, minLiquidity)
  return response.status(200).json(pools)
}

export default handler

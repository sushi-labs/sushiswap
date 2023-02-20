import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getAggregatorPoolsByTokenIds } from '../../../../../../../lib/api.js'
import type { PoolType } from '../../../../../../../lib/index.js'

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
  token0: z.string(),
  token1: z.string(),
  size: z.coerce.number().int().gte(0).lte(1000),
  excludeTopPoolsSize: z.coerce.number().int().gte(0).lte(1000),
  topPoolMinLiquidity: z.coerce.number().int().optional(),
})

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=2592000')
  const result = schema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const {
    chainId,
    protocol,
    version,
    poolTypes,
    token0,
    token1,
    size,
    excludeTopPoolsSize,
    topPoolMinLiquidity,
  } = result.data
  if (token0.toLowerCase() === token1.toLowerCase()) {
    return response.status(400).send('token0 and token1 must be different')
  }

  const pools = await getAggregatorPoolsByTokenIds(
    chainId,
    protocol,
    version,
    poolTypes,
    token0,
    token1,
    size,
    excludeTopPoolsSize,
    topPoolMinLiquidity
  )
  return response.status(200).json(pools)
}

export default handler

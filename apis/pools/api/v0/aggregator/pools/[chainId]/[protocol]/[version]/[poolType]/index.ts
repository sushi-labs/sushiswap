import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { PoolType } from '../../../../../../../../lib'
import { getPoolsByTokenIds } from '../../../../../../../../lib/api'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  protocol: z.string(),
  version: z.string(),
  poolType: z.nativeEnum(PoolType),
  size: z.coerce.number().int().gte(0).lte(1000),
  token0: z.string(),
  token1: z.string(),
  excludeTopPoolsSize: z.coerce.number().int().gte(0).lte(1000),
})

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const result = schema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId, protocol, version, poolType, size, token0, token1, excludeTopPoolsSize } = result.data
  if (token0.toLowerCase() === token1.toLowerCase()) {
    return response.status(400).send('token0 and token1 must be different')
  }

  const pools = await getPoolsByTokenIds(
    chainId,
    protocol,
    version,
    poolType,
    token0,
    token1,
    size,
    excludeTopPoolsSize
  )
  return response.status(200).json(pools)
}

export default handler

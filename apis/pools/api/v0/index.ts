import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getEarnPools } from '../../lib/api'
import { PoolsApiSchema } from '../../lib/schemas'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const result = PoolsApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const pools = await getEarnPools(result.data)
  return response.status(200).json(pools)
}

export default handler

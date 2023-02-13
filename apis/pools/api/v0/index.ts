import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getPools } from '../../lib/api.js'
import { PoolsApiSchema } from '../../lib/schemas/index.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=300')

  const result = PoolsApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const pools = await getPools(result.data)
  return response.status(200).json(pools)
}

export default handler

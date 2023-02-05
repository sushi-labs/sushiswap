import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getPools } from '../../lib/api.js'
import { PoolsApiSchema } from '../../lib/schemas/index.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const result = PoolsApiSchema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const pools = await getPools(result.data)
  return response.status(200).json(pools)
}

export default handler

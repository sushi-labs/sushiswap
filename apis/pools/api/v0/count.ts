import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getPoolCount } from '../../lib/api.js'
import { PoolCountApiSchema } from '../../lib/schemas/index.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const result = PoolCountApiSchema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const count = await getPoolCount(result.data)
  return response.status(200).json({ count })
}

export default handler

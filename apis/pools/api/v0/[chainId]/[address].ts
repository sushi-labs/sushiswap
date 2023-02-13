import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getPool } from '../../../lib/api.js'
import { PoolApiSchema } from '../../../lib/schemas/index.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=60')

  const result = PoolApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }
  const pool = await getPool(result.data)
  return response.status(200).json(pool)
}

export default handler

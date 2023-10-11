import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getEarnPool } from '../../../lib/api'
import { PoolApiSchema } from '../../../lib/schemas'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const result = PoolApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }
  const pool = await getEarnPool(result.data)
  return response.status(200).json(pool)
}

export default handler

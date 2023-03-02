import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getEarnPoolCount } from '../../lib/api/earn.js'
import { PoolCountApiSchema } from '../../lib/schemas/index.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=300')

  const result = PoolCountApiSchema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const count = await getEarnPoolCount(result.data)
  return response.status(200).json(count)
}

export default handler

import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getAggregatorPoolsByTokenIds } from '../../../../../../../lib/api/index.js'
import { AggregatorPoolsByTokenIdsSchema } from '../../../../../../../lib/schemas/index.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=60')

  const result = AggregatorPoolsByTokenIdsSchema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  if (result.data.token0 === result.data.token1) {
    return response.status(400).send('token0 and token1 must be different')
  }

  const pools = await getAggregatorPoolsByTokenIds(result.data)
  return response.status(200).json(pools)
}

export default handler

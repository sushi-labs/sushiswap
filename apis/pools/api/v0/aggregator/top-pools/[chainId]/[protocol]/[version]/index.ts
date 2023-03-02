import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getAggregatorTopPools } from '../../../../../../../lib/api/aggregator.js'
import { AggregatorTopPools } from '../../../../../../../lib/schemas/index.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=2592000')

  const result = AggregatorTopPools.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const pools = await getAggregatorTopPools(result.data)
  return response.status(200).json(pools)
}

export default handler

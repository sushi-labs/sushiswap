import type { VercelRequest, VercelResponse } from '@vercel/node'
import { roundToNearestMinutes, sub } from 'date-fns'

import { getPricesByChainId } from '../../../lib/api/v1'
import { TokenPricesChainV1ApiSchema } from '../../../lib/schemas/v1/chainId/index'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

  const result = TokenPricesChainV1ApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId, currency } = result.data

  const threeDaysAgo = sub(new Date(), { days: 3 })
  const dateThreshold = roundToNearestMinutes(threeDaysAgo, { nearestTo: 10 })

  const tokens = await getPricesByChainId(chainId, dateThreshold, currency)
  return response.status(200).json(tokens)
}

export default handler

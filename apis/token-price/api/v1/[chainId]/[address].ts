import type { VercelRequest, VercelResponse } from '@vercel/node'
import { roundToNearestMinutes, sub } from 'date-fns'

import { getPrice } from '../../../lib/api/v1.js'
import { TokenPriceV1ApiSchema } from '../../../lib/schemas/v1/chainId/address.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

  const result = TokenPriceV1ApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId, address, currency } = result.data

  const oneWeekAgo = sub(new Date(), { days: 7 })
  const dateThreshold = roundToNearestMinutes(oneWeekAgo, { nearestTo: 10 })

  const token = await getPrice(chainId, address, dateThreshold, currency)
  if (token === undefined) return response.status(404).send(0)

  return response.status(200).json(token)
}

export default handler

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { roundToNearestMinutes, sub } from 'date-fns'
import { z } from 'zod'

import { getPrices } from '../../lib/api.js'
import { Currency } from '../../lib/enums.js'

const schema = z.object({
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

  const { currency } = schema.parse(request.query)
  const threeDaysAgo = sub(new Date(), { days: 3 })
  const dateThreshold = roundToNearestMinutes(threeDaysAgo, { nearestTo: 10 })

  const tokens = await getPrices(dateThreshold, currency)
  return response.status(200).json(tokens)
}

export default handler

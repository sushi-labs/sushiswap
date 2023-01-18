import type { VercelRequest, VercelResponse } from '@vercel/node'
import { roundToNearestMinutes, sub } from 'date-fns'
import { z } from 'zod'

import { getPrice } from '../../../lib/api'
import { Currency } from '../../../lib/enums'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, address, currency } = schema.parse(request.query)
  const threeDaysAgo = sub(new Date(), { days: 3 })
  const dateThreshold = roundToNearestMinutes(threeDaysAgo, { nearestTo: 10 })

  const token = await getPrice(chainId, address, dateThreshold, currency)
  if (token === undefined) return response.status(404).send(0)

  return response.status(200).json(token)
}

export default handler

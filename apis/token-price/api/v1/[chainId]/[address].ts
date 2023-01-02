import type { VercelRequest, VercelResponse } from '@vercel/node'
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

  const currenDate = new Date()
  const dateThreshold = new Date(currenDate.setDate(currenDate.getDate() - 3)) // 3 days ago
  dateThreshold.setHours(0, 0, 0, 0) // Needed for the middleware cache to hit

  const token = await getPrice(chainId, address, dateThreshold, currency)
  console.log({token})
  if (token === undefined) return response.status(404).json({})

  return response.status(200).json(token)
}

export default handler

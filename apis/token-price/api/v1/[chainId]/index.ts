import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getPricesByChainId } from '../../../lib/api'
import { Currency } from '../../../lib/enums'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, currency } = schema.parse(request.query)
  const currenDate = new Date()
  const dateThreshold = new Date(currenDate.setDate(currenDate.getDate() - 3)) // 3 days ago
  dateThreshold.setHours(0, 0, 0, 0) // Needed for the middleware cache to hit
  

  const tokens = await getPricesByChainId(chainId, dateThreshold, currency)
  return response.status(200).json(tokens)
}

export default handler

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { Currency } from '../../../lib/enums.js'
import { getPrices } from '../../../lib/v2.js'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

  const { chainId, currency } = schema.parse(request.query)

  const tokens = await getPrices(chainId, currency)
  return response.status(200).json(tokens)
}

export default handler

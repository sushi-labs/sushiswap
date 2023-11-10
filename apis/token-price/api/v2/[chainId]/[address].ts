import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { Currency } from '../../../lib/enums.js'

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
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

  const { chainId, currency, address } = schema.parse(request.query)

  // const price = await getPrice(chainId, address, currency)

  return response.status(200).json({ chainId, currency, address })
}

export default handler

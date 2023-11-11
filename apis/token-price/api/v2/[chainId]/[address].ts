import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isAddress } from 'viem'
import { z } from 'zod'
import { getPrice } from '../../../lib/api/v2.js'
import { Currency } from '../../../lib/enums.js'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string().refine(isAddress, {
    message: 'Address is not checksummed.',
  }),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

  const { chainId, currency, address } = schema.parse(request.query)

  const price = await getPrice(chainId, address, currency)

  console.log('token price', price)

  if (price === undefined) return response.status(404).send(0)

  return response.status(200).json(price)
}

export default handler

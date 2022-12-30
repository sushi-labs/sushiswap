import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  fromToken: z.coerce.string(),
  toToken: z.coerce.string(),
  gasPrice: z.coerce.number().int().gte(0),
  amount: z.coerce.number().int().gte(0),
})

const handler = (request: VercelRequest, response: VercelResponse) => {
  console.log('query', request.query)
  const { chainId, fromToken, toToken, amount, gasPrice } = schema.parse(request.query)
  return response.status(200).json({ chainId, fromToken, toToken, amount, gasPrice })
}

export default handler

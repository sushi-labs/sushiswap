import type { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'
import { z } from 'zod'

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
})

const tokensSchema = z.array(z.coerce.string())

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, address } = querySchema.parse(request.query)

  const res = await fetch(`https://tokens.sushi.com/v0/${chainId}/addresses`)
  const data = await res.json()
  const tokens = tokensSchema.parse(data)

  return response.status(200).json({ chainId, address, tokens })
}

export default handler

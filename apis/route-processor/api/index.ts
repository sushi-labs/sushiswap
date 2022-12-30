import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

const schema = z.object({
  srcChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  dstChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  srcToken: z.string(),
  dstToken: z.string(),
  amount: z.number(),
  gasPrice: z.number(),
})

const handler = (request: VercelRequest, response: VercelResponse) => {
  const { srcChainId, dstChainId, gasPrice, srcToken, dstToken } = schema.parse(request.query)

  return response.status(200).json({ srcChainId, dstChainId, gasPrice, srcToken, dstToken })
}

export default handler

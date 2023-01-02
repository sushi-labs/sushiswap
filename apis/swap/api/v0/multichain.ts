import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

// const srcChainIds = SWAP_ENABLED_NETWORKS.map((chainId) => chainId)
// const dstChainIds = SWAP_ENABLED_NETWORKS.map((chainId) => chainId)

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
  srcToken: z.coerce.string(),
  dstToken: z.coerce.string(),
  gasPrice: z.coerce.number().int().gte(0),
  amount: z.coerce.number().int().gte(0),
})

const handler = (request: VercelRequest, response: VercelResponse) => {
  const { srcChainId, dstChainId, srcToken, dstToken, gasPrice, amount } = schema.parse(request.query)
  return response.status(200).json({ srcChainId, dstChainId, srcToken, dstToken, gasPrice, amount })
}

export default handler

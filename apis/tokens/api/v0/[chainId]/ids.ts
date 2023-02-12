import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getTokenIdsByChainId } from '../../../lib/api.js'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId } = schema.parse(request.query)
  const token = await getTokenIdsByChainId(chainId)
  return response.status(200).json(token.map(({ id }) => id))
}

export default handler

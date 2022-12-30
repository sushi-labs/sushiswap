import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getToken } from '../../../lib/api'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, address } = schema.parse(request.query)
  const token = await getToken(chainId, address)
  return response.status(200).json(token)
}

export default handler

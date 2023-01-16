import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getIncentivesByChainId } from '../../../lib/api'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const result = schema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }
  const { chainId } = result.data

  const incentives = await getIncentivesByChainId(chainId)
  return response.status(200).json(incentives)
}

export default handler

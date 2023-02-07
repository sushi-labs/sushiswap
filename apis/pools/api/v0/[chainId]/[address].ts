import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getPool } from '../../../lib/api.js'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const result = schema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }
  const { chainId, address } = result.data

  const pool = await getPool(chainId, address)
  return response.status(200).json(pool)
}

export default handler

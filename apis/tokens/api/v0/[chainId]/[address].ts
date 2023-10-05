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
  response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400')
  const { chainId, address } = schema.parse(request.query)
  try {
    const token = await getToken(chainId, address)
    return response.status(200).json(token)
  } catch (error) {
    return response.status(404).send('Not found')
  }
}

export default handler

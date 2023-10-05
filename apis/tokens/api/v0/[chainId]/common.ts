import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getCommonTokens } from '../../../lib/api'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400')
  const { chainId } = schema.parse(_request.query)
  const tokens = await getCommonTokens(chainId)
  return response.status(200).json(tokens)
}

export default handler

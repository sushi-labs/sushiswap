import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokenIdsByChainId } from '../../../lib/api/v0.js'
import { TokenIdsApiSchema } from '../../../lib/schemas/chainId/ids.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=86400',
  )

  const result = TokenIdsApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId } = result.data

  const token = await getTokenIdsByChainId(chainId)
  return response.status(200).json(token.map(({ id }) => id))
}

export default handler

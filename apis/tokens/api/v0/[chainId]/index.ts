import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokensByChainId } from '../../../lib/api.js'
import { TokensByChainIdApiSchema } from '../../../lib/schemas/chainId/index.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=86400',
  )

  const result = TokensByChainIdApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId } = result.data

  const tokens = await getTokensByChainId(chainId)
  return response.status(200).json(tokens)
}

export default handler

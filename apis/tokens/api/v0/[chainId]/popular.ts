import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getPopularTokens } from '../../../lib/api/v0.js'
import { PopularTokensApiSchema } from '../../../lib/schemas/chainId/popular.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=86400',
  )

  const result = PopularTokensApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId } = result.data

  const tokens = await getPopularTokens(chainId)
  return response.status(200).json(tokens)
}

export default handler

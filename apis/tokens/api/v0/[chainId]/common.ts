import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getCommonTokens } from '../../../lib/api/v0.js'
import { CommonTokensApiSchema } from '../../../lib/schemas/chainId/common.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=86400',
  )

  const result = CommonTokensApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId } = result.data

  const tokens = await getCommonTokens(chainId)
  return response.status(200).json(tokens)
}

export default handler

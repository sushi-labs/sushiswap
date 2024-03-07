import type { VercelRequest, VercelResponse } from '@vercel/node'

import { SearchTokenApiSchema } from '../../../lib/schemas/search/address.js'
import { getTokensByAddress } from '../../../lib/api/v2.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=86400',
  )

  const result = SearchTokenApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { address } = result.data

  try {
    const tokens = await getTokensByAddress(address)
    return response.status(200).json(tokens)
  } catch {
    return response.status(404).send('Not found')
  }
}

export default handler

import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokenAddressesByChainId } from '../../../lib/api.js'
import { TokenAddressesApiSchema } from '../../../lib/schemas/chainId/addresses.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=86400',
  )

  const result = TokenAddressesApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainId } = result.data

  const token = await getTokenAddressesByChainId(chainId)
  return response.status(200).json(token.map(({ address }) => address))
}

export default handler

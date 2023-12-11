import type { VercelRequest, VercelResponse } from '@vercel/node'

import { isExtractorSupportedChainId } from 'sushi/config'
import { getPrices } from '../../../lib/api/v2.js'
import { TokenPricesChainV2ApiSchema } from '../../../lib/schemas/v2/chainId/index.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=300, stale-while-revalidate=600',
  )

  const { chainId, currency } = TokenPricesChainV2ApiSchema.parse(request.query)

  if (!isExtractorSupportedChainId(chainId)) {
    const res = await fetch(
      `https://token-price.sushi.com/v1/${chainId}?currency=${currency}`,
    )
    const prices = await res.json()
    return response.status(200).json(prices)
  } else {
    const prices = await getPrices(chainId, currency)
    return response.status(200).json(prices)
  }
}

export default handler

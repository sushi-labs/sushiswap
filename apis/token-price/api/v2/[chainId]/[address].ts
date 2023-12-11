import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isExtractorSupportedChainId } from 'sushi/config'
import { getPrice } from '../../../lib/api/v2.js'
import { TokenPriceV2ApiSchema } from '../../../lib/schemas/v2/chainId/address.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=300, stale-while-revalidate=600',
  )

  const { chainId, currency, address } = TokenPriceV2ApiSchema.parse(
    request.query,
  )

  if (!isExtractorSupportedChainId(chainId)) {
    const price = await fetch(
      `https://token-price.sushi.com/v1/${chainId}/${address}?currency=${currency}`,
    )
    const json = await price.json()
    return response.status(200).json(json)
  } else {
    const price = await getPrice(chainId, address, currency)

    if (price === undefined) return response.status(404).send(0)

    return response.status(200).json(price)
  }
}

export default handler

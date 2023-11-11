import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { isExtractorSupportedChainId } from 'sushi/config'
import { Currency, getPrices } from '../../../lib/api/v2.js'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')

  const { chainId, currency } = schema.parse(request.query)

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

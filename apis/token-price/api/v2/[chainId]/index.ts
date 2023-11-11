import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { isExtractorSupportedChainId } from 'sushi/config'
import { getPrices } from '../../../lib/api/v2.js'
import { Currency } from '../../../lib/enums.js'

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
    return fetch(
      `https://token-price.sushi.com/v1/${chainId}?currency=${currency}`,
    )
  }

  const tokens = await getPrices(chainId, currency)
  return response.status(200).json(tokens)
}

export default handler

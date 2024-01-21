import { z } from 'zod'

import { isExtractorSupportedChainId } from 'sushi/config'

import { Currency, getPrices } from 'src/lib/price/v2'

import { NextRequest } from 'next/server'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  currency: z
    .nativeEnum(Currency)
    .nullable()
    .transform((currency) => currency ?? Currency.USD),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string } },
) {
  const { chainId, currency } = schema.parse({
    currency: request.nextUrl.searchParams.get('currency'),
    chainId: params.chainId,
  })

  const prices = !isExtractorSupportedChainId(chainId)
    ? await fetch(`https://sushi.com/api/price/v1/${chainId}?currency=${currency}`).then(
        (res) => res.json(),
      )
    : await getPrices(chainId, currency)

  return Response.json(prices, {
    headers: {
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  })
}

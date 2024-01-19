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

export const revalidate = 600

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string } },
) {
  const { chainId, currency } = schema.parse({
    currency: request.nextUrl.searchParams.get('currency'),
    chainId: params.chainId,
  })

  if (!isExtractorSupportedChainId(chainId)) {
    const res = await fetch(
      `https://token-price.sushi.com/v1/${chainId}?currency=${currency}`,
    )
    const prices = await res.json()
    return Response.json(prices)
  } else {
    const prices = await getPrices(chainId, currency)
    return Response.json(prices)
  }
}

import { z } from 'zod'

import { isExtractorSupportedChainId } from 'sushi/config'

import { Currency, getPrices } from 'src/lib/price/v2'

import { NextRequest, NextResponse } from 'next/server'

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

export const revalidate = 60

async function fetchV1(chainId: number, currency: string) {
  return fetch(
    `https://sushi.com/api/price/v1/${chainId}?currency=${currency}`,
    { next: { revalidate: 0 } },
  ).then((res) => res.json())
}

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string } },
) {
  const { chainId, currency } = schema.parse({
    currency: request.nextUrl.searchParams.get('currency'),
    chainId: params.chainId,
  })

  const prices = !isExtractorSupportedChainId(chainId)
    ? await fetchV1(chainId, currency)
    : await getPrices(chainId, currency)

  return NextResponse.json(prices)
}

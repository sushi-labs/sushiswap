import { z } from 'zod'

import { getAddress } from 'viem'

import { isExtractorSupportedChainId } from 'sushi/config'

import { Currency, getPrice } from 'src/lib/price/v2'

import { NextRequest } from 'next/server'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string().transform((address) => getAddress(address)),
  currency: z
    .nativeEnum(Currency)
    .nullable()
    .transform((currency) => currency ?? Currency.USD),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string; address: string } },
) {
  const { chainId, currency, address } = schema.parse({
    currency: request.nextUrl.searchParams.get('currency'),
    chainId: params.chainId,
    address: params.address,
  })

  const price = !isExtractorSupportedChainId(chainId)
    ? await fetch(
        `/api/price/v1/${chainId}/${address}?currency=${currency}`,
      ).then((res) => res.json())
    : await getPrice(chainId, address, currency)

  if (price === undefined) return new Response('0', { status: 404 })

  return Response.json(price, {
    headers: {
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  })
}

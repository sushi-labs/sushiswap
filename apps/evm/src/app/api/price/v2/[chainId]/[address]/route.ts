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

export const revalidate = 600

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string; address: string } },
) {
  const { chainId, currency, address } = schema.parse({
    currency: request.nextUrl.searchParams.get('currency'),
    chainId: params.chainId,
    address: params.address,
  })

  if (!isExtractorSupportedChainId(chainId)) {
    const price = await fetch(
      `https://token-price.sushi.com/v1/${chainId}/${address}?currency=${currency}`,
    )
    const json = await price.json()
    return Response.json(json)
  } else {
    const price = await getPrice(chainId, address, currency)

    if (price === undefined) return new Response('0', { status: 404 })

    return Response.json(price)
  }
}

import { NextRequest } from 'next/server'
import { isPromiseFulfilled } from 'sushi'
import { EXTRACTOR_SUPPORTED_CHAIN_IDS, ExtractorSupportedChainId } from 'sushi/config'

import { z } from 'zod'

const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
} as const

export const schema = z.object({
  currency: z
    .nativeEnum(Currency)
    .nullable()
    .transform((transform) => transform ?? Currency.USD),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    currency: request.nextUrl.searchParams.get('currency'),
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }
  const results = await Promise.allSettled(EXTRACTOR_SUPPORTED_CHAIN_IDS.map(chainId => fetch(`https://api.sushi.com/price/v1/${chainId}`).then(res => res.json())))
  const prices = results.reduce((previousValue, currentValue, i) => {
    previousValue[EXTRACTOR_SUPPORTED_CHAIN_IDS[i]] = isPromiseFulfilled(currentValue) ? currentValue.value : {}
    return previousValue
  }, {} as Record<ExtractorSupportedChainId, Record<string, number>>)
  return Response.json(prices, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}

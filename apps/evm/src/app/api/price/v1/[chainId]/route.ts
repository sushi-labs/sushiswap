import { roundToNearestMinutes, sub } from 'date-fns'

import { NextRequest } from 'next/server'
import { getPricesByChainId } from 'src/lib/price/v1'
import { schema } from './schema'

export const revalidate = 600

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string } },
) {
  const result = schema.safeParse({
    currency: request.nextUrl.searchParams.get('currency'),
    chainId: params.chainId,
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 422 })
  }

  const { chainId, currency } = result.data

  const threeDaysAgo = sub(new Date(), { days: 3 })
  const dateThreshold = roundToNearestMinutes(threeDaysAgo, { nearestTo: 10 })

  const tokens = await getPricesByChainId(chainId, dateThreshold, currency)
  return Response.json(tokens)
}

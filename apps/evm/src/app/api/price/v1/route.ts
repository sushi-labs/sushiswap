import { roundToNearestMinutes, sub } from 'date-fns'
import { NextRequest } from 'next/server'

import { getPrices } from 'src/lib/price/v1'

import { schema } from './schema'

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    currency: request.nextUrl.searchParams.get('currency'),
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  const { currency } = result.data
  const threeDaysAgo = sub(new Date(), { days: 3 })
  const dateThreshold = roundToNearestMinutes(threeDaysAgo, { nearestTo: 10 })

  const tokens = await getPrices(dateThreshold, currency)
  return Response.json(tokens, {
    headers: {
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  })
}

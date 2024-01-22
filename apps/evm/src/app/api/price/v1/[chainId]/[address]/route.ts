import { roundToNearestMinutes, sub } from 'date-fns'
import { NextRequest } from 'next/server'

import { getPrice } from 'src/lib/price/v1'
import { schema } from './schema'

export const revalidate = 600

export async function GET(
  request: NextRequest,
  { params }: { params: { chainId: string; address: string } },
) {
  const result = schema.safeParse({
    currency: request.nextUrl.searchParams.get('currency'),
    chainId: params.chainId,
    address: params.address,
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 422 })
  }

  const { chainId, address, currency } = result.data

  const oneWeekAgo = sub(new Date(), { days: 7 })
  const dateThreshold = roundToNearestMinutes(oneWeekAgo, { nearestTo: 10 })

  const token = await getPrice(chainId, address, dateThreshold, currency)
  if (token === undefined) return new Response('0', { status: 404 })

  return Response.json(token, {
    headers: {
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  })
}

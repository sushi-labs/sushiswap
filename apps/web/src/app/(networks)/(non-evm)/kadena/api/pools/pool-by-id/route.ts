import { type GetPoolTimeframe, getPool } from '@sushiswap/graph-client/kadena'
import type { NextRequest } from 'next/server'

import { z } from 'zod'

const validTimeFrame: GetPoolTimeframe[] = [
  'DAY',
  'WEEK',
  'MONTH',
  'YEAR',
  'ALL',
  undefined,
]

const schema = z.object({
  poolId: z.string(),
  timeFrame: z
    .string()
    .refine((val): val is Exclude<GetPoolTimeframe, undefined> =>
      validTimeFrame.includes(val as GetPoolTimeframe),
    ),
  first: z.number().min(1).max(1).default(1),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    poolId: request.nextUrl.searchParams.get('poolId'),
    timeFrame: request.nextUrl.searchParams.get('timeFrame'),
    first: Number(request.nextUrl.searchParams.get('first')),
  })

  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  const data = await getPool({
    poolId: result.data.poolId,
    timeFrame: result.data.timeFrame,
    first: result.data.first,
  })

  return Response.json(data, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}

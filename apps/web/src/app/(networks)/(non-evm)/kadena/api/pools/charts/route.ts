import {
  type PoolTimeFrame,
  getPoolCharts,
} from '@sushiswap/graph-client/kadena'
import type { NextRequest } from 'next/server'

import { z } from 'zod'

const validTimeFrame: PoolTimeFrame[] = [
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
    .refine((val): val is Exclude<PoolTimeFrame, undefined> =>
      validTimeFrame.includes(val as PoolTimeFrame),
    ),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    poolId: request.nextUrl.searchParams.get('poolId'),
    timeFrame: request.nextUrl.searchParams.get('timeFrame'),
  })

  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  const data = await getPoolCharts({
    poolId: result.data.poolId,
    timeFrame: result.data.timeFrame,
  })

  return Response.json(data, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}

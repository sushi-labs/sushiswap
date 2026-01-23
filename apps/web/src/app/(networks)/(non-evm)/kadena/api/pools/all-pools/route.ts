import {
  type GetPoolsOrderBy,
  getAllPools,
} from '@sushiswap/graph-client/kadena'
import type { NextRequest } from 'next/server'

import * as z from 'zod'

const schema = z.object({
  orderBy: z
    .enum([
      'TVL_USD_DESC',
      'TVL_USD_ASC',
      'VOLUME_24H_ASC',
      'VOLUME_24H_DESC',
      'VOLUME_7D_ASC',
      'VOLUME_7D_DESC',
      'APR_24H_ASC',
      'APR_24H_DESC',
      'TRANSACTION_COUNT_24H_ASC',
      'TRANSACTION_COUNT_24H_DESC',
    ])
    .optional(),
  first: z.number().min(1).default(50),
  pageParam: z.string().nullable().default(null),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    orderBy: request.nextUrl.searchParams.get('orderBy'),
    first: Number(request.nextUrl.searchParams.get('first')),
    pageParam: request.nextUrl.searchParams.get('pageParam'),
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  const data = await getAllPools({
    orderBy: result.data.orderBy as GetPoolsOrderBy,
    first: result.data.first,
    after: result.data.pageParam ?? undefined,
  })

  return Response.json(data, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}

import { getPoolTransactions } from '@sushiswap/graph-client/kadena'
import type { NextRequest } from 'next/server'

import { z } from 'zod'

const schema = z.object({
  pairId: z.string(),
  type: z.enum(['SWAP', 'ADD_LIQUIDITY', 'REMOVE_LIQUIDITY']),
  first: z.number().min(1).default(50),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    pairId: request.nextUrl.searchParams.get('pairId'),
    type: request.nextUrl.searchParams.get('type'),
    first: Number(request.nextUrl.searchParams.get('first')),
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  const data = await getPoolTransactions({
    pairId: result.data.pairId,
    type: result.data.type,
    first: result.data.first,
  })

  return Response.json(data, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}

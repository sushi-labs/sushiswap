import { getWalletPositions } from '@sushiswap/graph-client/kadena'
import type { NextRequest } from 'next/server'

import { z } from 'zod'

const schema = z.object({
  walletAddress: z.string(),
  pageSize: z.number().min(1).default(50),
  pageParam: z.string().nullable().default(null),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    walletAddress: request.nextUrl.searchParams.get('walletAddress'),
    pageSize: Number(request.nextUrl.searchParams.get('pageSize')),
    pageParam: request.nextUrl.searchParams.get('pageParam'),
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  const data = await getWalletPositions({
    walletAddress: result.data.walletAddress,
    first: result.data.pageSize,
    after: result.data.pageParam ?? undefined,
  })

  return Response.json(data, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}

import { fetchTokenPrice } from '@kinesis-bridge/kinesis-sdk/dist/bridgeHelpers'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  network: z.string().min(1, 'Network is required'),
  tokenAddress: z.string().min(1, 'Token address is required'),
})

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    network: request.nextUrl.searchParams.get('network'),
    tokenAddress: request.nextUrl.searchParams.get('tokenAddress'),
  })

  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  try {
    const price = await fetchTokenPrice(
      result.data.network,
      result.data.tokenAddress,
    )

    return Response.json(
      { price },
      {
        headers: {
          'Cache-Control': 'max-age=60, stale-while-revalidate=600',
        },
      },
    )
  } catch (err: any) {
    return Response.json(
      { error: err.message ?? 'Failed to fetch token price' },
      { status: 500 },
    )
  }
}

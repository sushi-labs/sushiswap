import { type NextRequest, NextResponse } from 'next/server'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'
import {
  type PoolTimeFrame,
  getPoolCharts,
} from '~kadena/_common/lib/graphql/queries/get-pool-by-id-charts'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(req.url)
  const { id: poolId } = await params

  const timeFrame = searchParams.get('timeFrame') as PoolTimeFrame

  const query = getPoolCharts({
    poolId: decodeURIComponent(poolId),
    timeFrame: timeFrame || 'DAY',
  })

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.KADINDEXER_API_KEY ?? '',
      },
      body: query,
    })

    if (!res.ok) throw new Error('Failed to fetch GetPoolChart')

    const result = await res.json()

    const txData = result?.data?.pool

    return NextResponse.json({
      success: true,
      data: {
        charts: txData?.charts,
      },
    })
  } catch (err) {
    console.error('[GetPoolChart API]', err)
    return NextResponse.json({ success: false, data: [] })
  }
}

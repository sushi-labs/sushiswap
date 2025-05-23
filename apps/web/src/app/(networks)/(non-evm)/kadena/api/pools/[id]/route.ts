import { NextResponse } from 'next/server'
import { getPoolById } from '~kadena/_common/lib/graphql/queries/get-pool-by-id'

const GRAPHQL_ENDPOINT = 'https://api.mainnet.kadindexer.io/v0'

const timeFrameMap = {
  '1D': 'DAY',
  '1W': 'WEEK',
  '1M': 'MONTH',
  '1Y': 'YEAR',
  ALL: 'ALL',
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id: poolId } = await params

  const { searchParams } = new URL(req.url)
  const timeFrame = searchParams.get('timeFrame') ?? 'DAY'
  const first = Number.parseInt(searchParams.get('first') ?? '10', 10)

  if (!poolId) {
    return NextResponse.json({
      success: false,
      message: 'Missing poolId in URL',
    })
  }

  try {
    const query = getPoolById({
      poolId,
      timeFrame: timeFrameMap[timeFrame as keyof typeof timeFrameMap],
      first,
    })

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.KADINDEXER_API_KEY ?? '',
      },
      body: query,
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch pool details')
    }

    const result = await res.json()

    const pool = result?.data?.pool

    const flattened = {
      ...pool,
      transactions: pool?.transactions?.edges?.map((e: any) => e.node) ?? [],
    }

    return NextResponse.json({
      success: true,
      data: flattened,
    })
  } catch (error) {
    console.error('[Pool By ID API]', error)
    return NextResponse.json({ success: false, data: null })
  }
}

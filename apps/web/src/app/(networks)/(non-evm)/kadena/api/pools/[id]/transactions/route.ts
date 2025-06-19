import { type NextRequest, NextResponse } from 'next/server'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'
import { getPoolTransactionsQuery } from '~kadena/_common/lib/graphql/queries/get-pool-transactions'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(req.url)
  const { id: pairId } = await params

  const type = searchParams.get('type')
  const first = Number.parseInt(searchParams.get('first') || '10', 10)
  const after = searchParams.get('after')

  const variables = {
    pairId: pairId,
    type,
    first,
    after,
  }

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.KADINDEXER_API_KEY ?? '',
      },
      body: JSON.stringify({ query: getPoolTransactionsQuery, variables }),
    })

    if (!res.ok) throw new Error('Failed to fetch pool transactions')

    const result = await res.json()

    const txData = result?.data?.poolTransactions

    return NextResponse.json({
      success: true,
      data: {
        transactions: txData.edges.map((e: any) => e.node),
        pageInfo: txData.pageInfo,
        totalCount: txData.totalCount,
      },
    })
  } catch (err) {
    console.error('[PoolTransactions API]', err)
    return NextResponse.json({ success: false, data: [] })
  }
}

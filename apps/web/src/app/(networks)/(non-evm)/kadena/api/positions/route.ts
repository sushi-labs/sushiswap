import { NextResponse } from 'next/server'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'
import { getWalletPositionsQuery } from '~kadena/_common/lib/graphql/queries/get-wallet-positions'

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('walletAddress')
  const first = Number(searchParams.get('first') ?? '10')
  const after = searchParams.get('after')

  if (!walletAddress) {
    return NextResponse.json({
      success: false,
      message: 'Missing walletAddress in query',
    })
  }

  const query = getWalletPositionsQuery({
    walletAddress,
    first,
    after,
  })
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.KADINDEXER_API_KEY ?? '',
      },
      body: query,
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error('Failed to fetch wallet positions')

    const result = await res.json()
    const connection = result?.data?.liquidityPositions

    return NextResponse.json({
      success: true,
      data: {
        positions: connection?.edges?.map((edge: any) => edge?.node) ?? [],
        pageInfo: connection?.pageInfo ?? {},
        totalCount: connection?.totalCount ?? 0,
      },
    })
  } catch (e) {
    console.error('[Wallet Positions API]', e)
    return NextResponse.json({ success: false, data: [], pageInfo: {} })
  }
}

import { NextResponse } from 'next/server'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'
import { getAllPools } from '~kadena/_common/lib/graphql/queries/get-all-pools'

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const first = Number.parseInt(searchParams.get('first') ?? '50', 10)
  const orderBy = searchParams.get('orderBy') ?? 'TVL_USD_DESC'
  const after = searchParams.get('after')

  try {
    const query = getAllPools({ first, orderBy, after })

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.KADENA_INDEXER_API_KEY ?? '',
      },
      body: query,
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch pools')
    }

    const result = await res.json()
    const poolsData = result?.data?.pools

    return NextResponse.json({
      success: true,
      data: {
        pools: poolsData?.edges?.map((edge: any) => edge?.node),
        pageInfo: poolsData?.pageInfo,
        totalCount: poolsData?.totalCount,
      },
    })
  } catch (error) {
    console.error('[Pools API]', error)
    return NextResponse.json({ success: false, data: [] })
  }
}

import { NextResponse } from 'next/server'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('walletAddress')

  if (!walletAddress) {
    return NextResponse.json({
      success: false,
      message: 'Missing walletAddress in query',
    })
  }

  const query = JSON.stringify({
    query: `
      query GetWalletPositions($walletAddress: String!) {
        liquidityPositions(walletAddress: $walletAddress, orderBy: VALUE_USD_DESC, first: 10) {
          edges {
            node {
              id
              pairId
              pair {
                address
                id
                reserve0
                reserve1
              }
              liquidity
              valueUsd
              apr24h
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          totalCount
        }
      }
    `,
    variables: {
      walletAddress,
    },
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

    console.log('result', result)

    const positions = result?.data?.liquidityPositions?.edges?.length
      ? result.data.liquidityPositions.edges.map((edge: any) => edge.node)
      : [
          {
            id: '112',
            pairId: '1',
            pair: {
              id: '1',
              address: 'mock.pool-1',
              reserve0: '1000',
              reserve1: '5000',
            },
            liquidity: '100',
            valueUsd: '1234.56',
            apr24h: '0.12',
          },
          {
            id: '113',
            pairId: '2',
            pair: {
              id: '2',
              address: 'mock.pool-2',
              reserve0: '2000',
              reserve1: '3000',
            },
            liquidity: '200',
            valueUsd: '2345.67',
            apr24h: '0.18',
          },
        ]

    return NextResponse.json({ success: true, data: positions })
  } catch (e) {
    console.error('[Wallet Positions API]', e)
    return NextResponse.json({ success: false, data: [] })
  }
}

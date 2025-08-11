import { NextResponse } from 'next/server'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'
import { getTokenPrice } from '~kadena/_common/lib/graphql/queries/get-token-price'

type TokenPriceResponse = {
  data: {
    tokenPrice: {
      id: string
      priceInKda: number
      priceInUsd: number
      protocolAddress: string
      token: {
        address: string
        id: string
        chainId: string
        name: string
      }
    } | null
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const tokenAddress = searchParams.get('tokenAddress') as string

  if (!tokenAddress) {
    return NextResponse.json({
      success: false,
      data: {
        priceUsd: 0,
      },
    })
  }

  try {
    const query = getTokenPrice({ tokenAddress })

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

    const result = (await res.json()) as TokenPriceResponse
    const priceData = result?.data.tokenPrice
    const priceUsd = priceData?.priceInUsd ?? 0

    return NextResponse.json({
      success: true,
      data: {
        priceUsd: priceUsd,
      },
    })
  } catch (error) {
    console.error('[Pools API]', error)
    return NextResponse.json({ success: false, data: [] })
  }
}

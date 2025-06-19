import { NextResponse } from 'next/server'
import { KADENA_CONTRACT } from '~kadena/_common/constants/contracts'
import { GRAPHQL_ENDPOINT } from '~kadena/_common/lib/graphql/endpoint'
import { getDexMetricsQuery } from '~kadena/_common/lib/graphql/queries/get-dex-metrics'

export async function GET(): Promise<NextResponse> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.KADINDEXER_API_KEY ?? '',
      },
      body: getDexMetricsQuery({ protocolAddress: KADENA_CONTRACT }),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch dex metrics')
    }

    const result = await res.json()
    const dexMetrics = result?.data?.dexMetrics

    return NextResponse.json({ success: true, data: dexMetrics })
  } catch (error) {
    console.error('[DEX Metrics API]', error)
    return NextResponse.json({ success: false, data: null })
  }
}

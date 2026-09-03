import { type NextRequest, NextResponse } from 'next/server'
import {
  getLayerZeroArrivalEstimate,
  getLayerZeroArrivalEstimateUrl,
} from 'src/lib/swap/layerzero/arrival-estimate'
import { isLayerZeroChainId } from 'src/lib/swap/layerzero/config'
import { StellarChainId } from 'sushi/stellar'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const fromChainId = Number(request.nextUrl.searchParams.get('fromChainId'))
  const toChainId = Number(request.nextUrl.searchParams.get('toChainId'))
  if (
    !isLayerZeroChainId(fromChainId) ||
    !isLayerZeroChainId(toChainId) ||
    fromChainId === toChainId ||
    (fromChainId !== StellarChainId.STELLAR &&
      toChainId !== StellarChainId.STELLAR)
  ) {
    return NextResponse.json(
      { message: 'Invalid transfer parameters' },
      { status: 400 },
    )
  }
  try {
    const response = await fetch(
      getLayerZeroArrivalEstimateUrl(fromChainId, toChainId),
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10_000),
      },
    )
    if (!response.ok) throw new Error('LayerZero timing unavailable')
    return NextResponse.json(
      getLayerZeroArrivalEstimate(
        await response.json(),
        fromChainId,
        toChainId,
      ),
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
        },
      },
    )
  } catch {
    return NextResponse.json(
      { message: 'LayerZero timing unavailable' },
      { status: 502 },
    )
  }
}

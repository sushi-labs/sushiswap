import { type NextRequest, NextResponse } from 'next/server'
import {
  getLayerZeroEid,
  isLayerZeroChainId,
} from 'src/lib/swap/layerzero/config'
import { parseLayerZeroStatus } from 'src/lib/swap/layerzero/status'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const txHash = request.nextUrl.searchParams.get('txHash') ?? ''
  const fromChainId = Number(request.nextUrl.searchParams.get('fromChainId'))
  const toChainId = Number(request.nextUrl.searchParams.get('toChainId'))
  if (
    !/^(0x)?[a-fA-F0-9]{64}$/.test(txHash) ||
    !isLayerZeroChainId(fromChainId) ||
    !isLayerZeroChainId(toChainId)
  ) {
    return NextResponse.json(
      { message: 'Invalid transfer parameters' },
      { status: 400 },
    )
  }
  try {
    const response = await fetch(
      `https://scan.layerzero-api.com/v1/messages/tx/${encodeURIComponent(txHash)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(10_000) },
    )
    if (!response.ok) throw new Error('LayerZero status unavailable')
    return NextResponse.json(
      parseLayerZeroStatus(
        await response.json(),
        getLayerZeroEid(fromChainId),
        getLayerZeroEid(toChainId),
      ),
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json(
      { message: 'LayerZero status unavailable' },
      { status: 502 },
    )
  }
}

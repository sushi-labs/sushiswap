import { type NextRequest, NextResponse } from 'next/server'
import {
  getLayerZeroEid,
  isLayerZeroChainId,
  isLayerZeroTransferPair,
} from 'src/lib/swap/layerzero/config'
import { parseLayerZeroStatus } from 'src/lib/swap/layerzero/status'
import type { LayerZeroStatus } from 'src/lib/swap/layerzero/types'
import { z } from 'zod'

const messageNotFoundSchema = z.object({ code: z.literal(4040) })

export async function GET(request: NextRequest): Promise<NextResponse> {
  const txHash = request.nextUrl.searchParams.get('txHash') ?? ''
  const fromChainId = Number(request.nextUrl.searchParams.get('fromChainId'))
  const toChainId = Number(request.nextUrl.searchParams.get('toChainId'))
  if (
    !/^(0x)?[a-fA-F0-9]{64}$/.test(txHash) ||
    !isLayerZeroChainId(fromChainId) ||
    !isLayerZeroChainId(toChainId) ||
    !isLayerZeroTransferPair(fromChainId, toChainId)
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
    const body: unknown = await response.json()
    let status: LayerZeroStatus
    if (
      response.status === 404 &&
      messageNotFoundSchema.safeParse(body).success
    ) {
      // Scan can return 4040 before it indexes a confirmed source transaction.
      status = { status: 'PENDING' }
    } else {
      if (!response.ok) throw new Error('LayerZero status unavailable')
      status = parseLayerZeroStatus(
        body,
        getLayerZeroEid(fromChainId),
        getLayerZeroEid(toChainId),
      )
    }
    return NextResponse.json(status, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json(
      { message: 'LayerZero status unavailable' },
      { status: 502 },
    )
  }
}

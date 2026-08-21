import { NextResponse, connection } from 'next/server'
import { readSwapEdgeConfig } from '~evm/[chainId]/(trade)/swap/get-swap-edge-config'

// Incident kill switch polled by the client every minute — never cached.
export async function GET() {
  await connection()

  return NextResponse.json(await readSwapEdgeConfig(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}

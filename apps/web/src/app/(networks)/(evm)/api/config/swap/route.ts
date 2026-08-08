import { NextResponse } from 'next/server'
import { getSwapEdgeConfig } from '~evm/[chainId]/(trade)/swap/get-swap-edge-config'

export async function GET() {
  return NextResponse.json(await getSwapEdgeConfig())
}

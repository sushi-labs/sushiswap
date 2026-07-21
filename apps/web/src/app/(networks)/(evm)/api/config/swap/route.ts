import { get } from '@vercel/edge-config'
import { NextResponse } from 'next/server'
import { parseSwapEdgeConfig } from '~evm/[chainId]/(trade)/swap/get-swap-edge-config'

export const runtime = 'edge'

export const revalidate = 60

export async function GET() {
  try {
    return NextResponse.json(parseSwapEdgeConfig(await get('swap')))
  } catch {
    return NextResponse.json(parseSwapEdgeConfig(undefined))
  }
}

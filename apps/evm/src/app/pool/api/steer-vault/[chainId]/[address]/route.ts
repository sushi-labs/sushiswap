import { SteerVaultApiSchema, getSteerVaultFromDB } from '@sushiswap/client/api'
import { type NextRequest, NextResponse } from 'next/server.js'

export async function GET(
  _request: NextRequest,
  { params }: { params: { chainId: string; address: string } },
) {
  const result = SteerVaultApiSchema.safeParse({
    chainId: params.chainId,
    address: params.address,
  })

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const pools = await getSteerVaultFromDB(result.data)
  return NextResponse.json(pools)
}

import { PoolApiSchema, getPoolFromDB } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'

export async function GET(
  _request: Request,
  { params }: { params: { chainId: string; address: string } },
) {
  const result = PoolApiSchema.safeParse({
    chainId: params.chainId,
    address: params.address,
  })

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const pools = await getPoolFromDB(result.data)
  return NextResponse.json(pools)
}

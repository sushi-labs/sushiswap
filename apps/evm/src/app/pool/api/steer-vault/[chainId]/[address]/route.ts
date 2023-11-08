import { SteerVaultApiSchema, getSteerVaultFromDB } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { CORS } from '../../../cors'

export async function GET(
  _request: Request,
  { params }: { params: { chainId: string; address: string } },
) {
  const result = SteerVaultApiSchema.safeParse({
    chainId: params.chainId,
    address: params.address,
  })

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const vault = await getSteerVaultFromDB(result.data)
  return NextResponse.json(vault, { headers: CORS })
}

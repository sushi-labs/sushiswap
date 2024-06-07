import { SteerVaultApiSchema, getSteerVaultFromDB } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { CORS } from '../../../cors'
import { JSONStringify } from 'json-with-bigint'

export const revalidate = 15

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
  const stringified = JSONStringify(vault)
  return new NextResponse(stringified, {
    status: 200,
    headers: { 'content-type': 'application/json', ...CORS },
  })
}

import {
  SteerVaultCountApiSchema,
  getSteerVaultCountFromDB,
} from '@sushiswap/client/api'
import { type NextRequest, NextResponse } from 'next/server.js'

export async function GET(request: NextRequest) {
  const result = SteerVaultCountApiSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  )

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const pools = await getSteerVaultCountFromDB(result.data)
  return NextResponse.json(pools)
}

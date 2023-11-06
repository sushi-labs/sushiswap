import {
  SteerVaultsApiSchema,
  getSteerVaultsFromDB,
} from '@sushiswap/client/api'
import { type NextRequest, NextResponse } from 'next/server.js'

export async function GET(request: NextRequest) {
  const result = SteerVaultsApiSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  )

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const pools = await getSteerVaultsFromDB(result.data)
  return NextResponse.json(pools)
}

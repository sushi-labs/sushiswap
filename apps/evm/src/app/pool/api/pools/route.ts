import { PoolsApiSchema, getPoolsFromDB } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = PoolsApiSchema.safeParse(Object.fromEntries(searchParams))

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const pools = await getPoolsFromDB(result.data)
  return NextResponse.json(pools)
}

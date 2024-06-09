import { PoolsApiSchema, getPoolsFromDB } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { serialize } from 'sushi/bigint-serializer'
import { CORS } from '../cors'

export const revalidate = 15

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = PoolsApiSchema.safeParse(Object.fromEntries(searchParams))

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const pools = await getPoolsFromDB(result.data)

  const stringified = serialize(pools)
  return new NextResponse(stringified, {
    status: 200,
    headers: { 'content-type': 'application/json', ...CORS },
  })
}

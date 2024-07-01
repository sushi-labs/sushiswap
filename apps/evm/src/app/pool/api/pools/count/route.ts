import 'sushi/bigint-serializer'

import { PoolCountApiSchema, getPoolCountFromDB } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { CORS } from '../../cors'

export const revalidate = 15

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = PoolCountApiSchema.safeParse(Object.fromEntries(searchParams))

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const count = await getPoolCountFromDB(result.data)
  return NextResponse.json(count, {
    headers: CORS,
  })
}

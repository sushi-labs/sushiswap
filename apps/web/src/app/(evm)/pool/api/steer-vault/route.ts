import 'sushi/bigint-serializer'

import {
  SteerVaultsApiSchema,
  getSteerVaultsFromDB,
} from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { CORS } from '../cors'

export const revalidate = 15

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = SteerVaultsApiSchema.safeParse(
    Object.fromEntries(searchParams),
  )

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const vaults = await getSteerVaultsFromDB(result.data)
  return NextResponse.json(vaults, {
    headers: CORS,
  })
}

import {
  SteerVaultCountApiSchema,
  getSteerVaultCountFromDB,
} from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { CORS } from '../../cors'

export const revalidate = 15

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = SteerVaultCountApiSchema.safeParse(
    Object.fromEntries(searchParams),
  )

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  const count = await getSteerVaultCountFromDB(result.data)
  return NextResponse.json(count, {
    headers: CORS,
  })
}

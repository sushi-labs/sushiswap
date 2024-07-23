import { getPools } from '@sushiswap/client'
import { PoolsApiSchema } from '@sushiswap/client/api'
import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainIds = searchParams.get('chainIds')
  const isIncentivized = searchParams.get('isIncentivized')
  const isWhitelisted = searchParams.get('isWhitelisted')
  const tokenSymbols = searchParams.get('tokenSymbols')
  const protocols = searchParams.get('protocols')
  const cursor = searchParams.get('cursor')
  const orderBy = searchParams.get('orderBy')
  const orderDir = searchParams.get('orderDir')
  const result = PoolsApiSchema.safeParse({
    chainIds,
    isIncentivized,
    isWhitelisted,
    tokenSymbols,
    protocols,
    cursor,
    orderBy,
    orderDir,
  })
  if (!result.success) {
    return new Response(result.error.message, { status: 422 })
  }
  const pools = await getPools(result.data)
  return NextResponse.json(pools, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
    },
  })
}

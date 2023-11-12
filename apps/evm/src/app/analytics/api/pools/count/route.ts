import { getPoolCount } from '@sushiswap/client'
import { PoolCountApiSchema } from '@sushiswap/client/api'
import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chainIds = searchParams.get('chainIds')
  const isIncentivized = searchParams.get('isIncentivized')
  const isWhitelisted = searchParams.get('isWhitelisted')
  const tokenSymbols = searchParams.get('tokenSymbols')
  const protocols = searchParams.get('protocols')
  const result = PoolCountApiSchema.safeParse({
    chainIds,
    isIncentivized,
    isWhitelisted,
    tokenSymbols,
    protocols,
  })
  if (!result.success) {
    return new Response(result.error.message, { status: 422 })
  }
  const count = await getPoolCount(result.data)
  return NextResponse.json(count)
}

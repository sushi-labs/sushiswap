import { NextResponse } from 'next/server'

import { getFuroTokens } from '../../lib/api'
import { FuroTokensSchema } from '../../lib/zod'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tokenSymbols = searchParams.get('tokenSymbols')
  const chainIds = searchParams.get('chainIds')
  const result = FuroTokensSchema.safeParse({ tokenSymbols, chainIds })
  if (!result.success) {
    return new Response(result.error.message, { status: 422 })
  }
  const tokens = await getFuroTokens(result.data)
  return NextResponse.json(tokens)
}

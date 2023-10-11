import { bentoBoxTokensSchema } from 'lib/schema'
import { NextResponse } from 'next/server'

import { getBentoBoxTokens } from '../../../../lib/analytics/api'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tokenSymbols = searchParams.get('tokenSymbols')
  const chainIds = searchParams.get('chainIds')
  const result = bentoBoxTokensSchema.safeParse({ tokenSymbols, chainIds })
  if (!result.success) {
    return new Response(result.error.message, { status: 422 })
  }
  const tokens = await getBentoBoxTokens(result.data)
  return NextResponse.json(tokens)
}

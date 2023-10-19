import { NextResponse } from 'next/server'

import { GetTokensQuery, getTokens } from '../../../../lib/analytics/api'

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const networks = searchParams.get('networks')
  const where = searchParams.get('where')
  const pagination = searchParams.get('pagination')
  const pairs = await getTokens({
    networks,
    where,
    pagination,
  } as GetTokensQuery)
  return NextResponse.json(pairs)
}

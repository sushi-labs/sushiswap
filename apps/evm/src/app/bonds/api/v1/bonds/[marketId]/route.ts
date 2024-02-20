import { BondApiSchema, getBondFromSubgraph } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { CORS } from '../../../cors'

export const revalidate = 3

export async function GET(
  _request: Request,
  { params }: { params: { marketId: string } },
) {
  const result = BondApiSchema.safeParse({
    marketId: params.marketId,
  })

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  try {
    const bond = await getBondFromSubgraph(result.data)

    if (!bond) {
      return NextResponse.json({ error: 'Bond not found' }, { status: 404 })
    }

    return NextResponse.json(bond, { headers: CORS })
  } catch (e) {
    return NextResponse.json(e, { headers: CORS })
  }
}

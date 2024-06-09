import { BondApiSchema, getBondFromSubgraph } from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { serialize } from 'sushi/bigint-serializer'
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

    const stringified = serialize(bond)
    return new NextResponse(stringified, {
      status: 200,
      headers: { 'content-type': 'application/json', ...CORS },
    })
  } catch (e) {
    return NextResponse.json(e, { headers: CORS })
  }
}

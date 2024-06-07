import {
  BondsPositionsApiSchema,
  getBondPositionsFromSubgraph,
} from '@sushiswap/client/api'
import { JSONStringify } from 'json-with-bigint'
import { NextResponse } from 'next/server.js'
import { CORS } from '../../cors'

export const revalidate = 3

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = BondsPositionsApiSchema.safeParse(
    Object.fromEntries(searchParams),
  )

  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 })
  }

  try {
    const positions = await getBondPositionsFromSubgraph(result.data)

    const stringified = JSONStringify(positions)
    return new NextResponse(stringified, {
      status: 200,
      headers: { 'content-type': 'application/json', ...CORS },
    })
  } catch (e) {
    return NextResponse.json(e, { headers: CORS })
  }
}

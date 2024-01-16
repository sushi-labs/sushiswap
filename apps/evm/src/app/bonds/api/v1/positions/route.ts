import {
  BondsPositionsApiSchema,
  getBondPositionsFromSubgraph,
} from '@sushiswap/client/api'
import { NextResponse } from 'next/server.js'
import { CORS } from '../../cors'

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
    return NextResponse.json(positions, { headers: CORS })
  } catch (e) {
    return NextResponse.json(e, { headers: CORS })
  }
}

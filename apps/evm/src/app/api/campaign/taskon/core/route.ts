import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_V3_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { NextRequest, NextResponse } from 'next/server'
import { ChainId } from 'sushi'
import { getAddress } from 'viem'
import { z } from 'zod'

const schema = z.object({
  address: z.coerce.string().transform((address) => getAddress(address)),
})

const poolAddress = '0xc1e92e02e12324b69ee0b29c6c6f471841d959ec' // CORE/BSSB - 1%

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  try {
    const { address } = schema.parse(params)
    const sdk = getBuiltGraphSDK({
      subgraphHost: SUBGRAPH_HOST[ChainId.CORE],
      subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[ChainId.CORE],
    })

    const { mints } = await sdk.V3Mints({
      where: { origin: address, pool: poolAddress },
    })

    if (mints.length > 0) {
      return NextResponse.json(
        { result: { isValid: true } },
        {
          headers: {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
          },
        },
      )
    }
  } catch (_) {}

  return NextResponse.json(
    { result: { isValid: false } },
    {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
      },
    },
  )
}

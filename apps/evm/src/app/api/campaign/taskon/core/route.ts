import { getSushiV3Mints } from '@sushiswap/graph-client-new/sushi-v3'
import { NextRequest, NextResponse } from 'next/server'
import { ChainId } from 'sushi/chain'
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

    const mints = await getSushiV3Mints({
      chainId: ChainId.CORE,
      where: {
        origin: address,
        pool: poolAddress,
      },
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

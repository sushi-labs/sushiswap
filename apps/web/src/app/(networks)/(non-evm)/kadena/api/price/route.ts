import { getTokenPrice } from '@sushiswap/graph-client/kadena'
import type { NextRequest } from 'next/server'
import { isKvmTokenAddress } from 'sushi/kvm'
import * as z from 'zod'

const schema = z.object({
  tokenAddress: z.string().refine((address) => isKvmTokenAddress(address), {
    message: 'Invalid Kvm address',
  }),
})

export const revalidate = 600

export async function GET(request: NextRequest) {
  const result = schema.safeParse({
    tokenAddress: request.nextUrl.searchParams.get('tokenAddress'),
  })
  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 })
  }

  const data = await getTokenPrice({
    tokenAddress: result.data.tokenAddress,
  })

  return Response.json(data, {
    headers: {
      'Cache-Control': 'max-age=60, stale-while-revalidate=600',
    },
  })
}

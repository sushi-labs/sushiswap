import {
  type TokenScannerChainId,
  isTokenScannerChainId,
  scanToken,
} from '@sushiswap/graph-client/de.fi'
import type { NextRequest } from 'next/server'
import type { EvmChainId } from 'sushi/chain'
import { getAddress } from 'viem/utils'
import { z } from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .refine((chainId) => isTokenScannerChainId(chainId as EvmChainId), {
      message: 'chainId must exist in TokenScannerChainId',
    })
    .transform((chainId) => chainId as TokenScannerChainId),
  address: z.string().transform((from) => getAddress(from)),
})

export const revalidate = 900000

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const result = schema.safeParse(params)

  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 })
  }

  const { chainId, address } = result.data

  const response = await scanToken({ chainId, address })

  return Response.json(response, {
    headers: {
      'Cache-Control': 'max-age=60000, stale-while-revalidate=9000000',
    },
  })
}

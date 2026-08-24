import type { NextRequest } from 'next/server'
import {
  type DirectPoolQuoteResponse,
  directPoolQuoteInputSchema,
} from 'src/lib/swap/direct-pool/api'
import { getDirectPoolQuoteContractParameters } from 'src/lib/swap/direct-pool/utils'
import { publicClientConfig } from 'src/lib/wagmi/config/viem'
import { createPublicClient } from 'viem'

export async function GET(request: NextRequest): Promise<Response> {
  const result = directPoolQuoteInputSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  )

  if (!result.success) {
    return Response.json(result.error.format(), {
      status: 400,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  try {
    const { amount, chainId, feeTier, tokenIn, tokenOut } = result.data
    const client = createPublicClient(publicClientConfig[chainId])
    const quote = await client.readContract(
      getDirectPoolQuoteContractParameters({
        amount: BigInt(amount),
        chainId,
        feeTier,
        tokenIn,
        tokenOut,
      }),
    )
    const response: DirectPoolQuoteResponse = {
      amountOut: quote[0].toString(),
      gasEstimate: quote[3].toString(),
    }

    return Response.json(response, {
      headers: {
        'Cache-Control':
          'public, max-age=0, s-maxage=2, stale-while-revalidate=3',
      },
    })
  } catch {
    return Response.json(
      { error: 'Failed to quote direct pool' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  }
}

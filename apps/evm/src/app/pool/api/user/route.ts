import { NextResponse } from 'next/server'
import { getUser } from 'src/lib/graph'
import { serialize } from 'sushi/bigint-serializer'
import { ChainId } from 'sushi/chain'
import { isSushiSwapV2ChainId } from 'sushi/config'
import { Address } from 'viem'
import { z } from 'zod'
import { CORS } from '../cors'

export const revalidate = 15

const schema = z.object({
  id: z
    .string()
    .refine((id) => id.startsWith('0x'))
    .transform((id) => id.toLowerCase() as Address),
  chainIds: z.nullable(z.string()).transform((chainIds) =>
    chainIds
      ?.split(',')
      .map((chainId) => Number(chainId) as ChainId)
      .filter(isSushiSwapV2ChainId),
  ),
})

// export const dynamic = 'auto'
// export const dynamicParams = true
// export const revalidate = false
// export const fetchCache = 'auto'
// export const runtime = 'nodejs'
// export const preferredRegion = 'auto'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const chainIds = searchParams.get('chainIds')
  if (!id) return new Response(null, { status: 422 })
  const result = schema.safeParse({ id, chainIds })
  if (!result.success) {
    return new Response(result.error.message, { status: 400 })
  }
  const args = result.data
  const data = await getUser(args)

  const stringified = serialize(data)
  return new NextResponse(stringified, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=15, stale-while-revalidate=600',
      'content-type': 'application/json',
      ...CORS,
    },
  })
}

import { z } from 'zod'
import { ChainId } from '@sushiswap/chain'
import { NextResponse } from 'next/server'
import { getUser } from 'lib/api'

const schema = z.object({
  id: z.string(),
  chainIds: z
    .nullable(z.string())
    .transform((chainIds) => chainIds?.split(',').map((chainId) => Number(chainId) as ChainId)),
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
  return NextResponse.json(data)
}

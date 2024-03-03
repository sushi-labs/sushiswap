import { Protocol } from '@sushiswap/client'
import { createClient } from '@sushiswap/database'
import { Ratelimit } from '@upstash/ratelimit'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from 'src/lib/rate-limit'
import { ChainId } from 'sushi/chain'
import { isBentoBoxChainId } from 'sushi/config'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/config'
import { z } from 'zod'
import { CORS } from '../../cors'

const schema = z.object({
  chainId: z.coerce
    .number()
    .refine(
      (chainId) =>
        isSushiSwapV2ChainId(chainId as ChainId) ||
        isSushiSwapV3ChainId(chainId as ChainId) ||
        isBentoBoxChainId(chainId as ChainId),
      { message: 'Invalid chainId' },
    )
    .transform((chainId) => {
      return chainId as ChainId
    }),
  protocol: z
    .string()
    .refine(
      (protocol) => Object.values(Protocol).includes(protocol as Protocol),
      {
        message: `Invalid protocol, valid values are: ${Object.values(
          Protocol,
        ).join(', ')}`,
      },
    )
    .transform((protocol) => protocol as Protocol),
  isApproved: z.coerce
    .string()
    .default('true')
    .refine((val) => ['true', 'false'].includes(val), {
      message: 'isApproved must true or false',
    })
    .transform((val) => val === 'true')
    .optional(),
})

export const revalidate = 300
export const maxDuration = 10

export async function GET(request: NextRequest) {
  const ratelimit = rateLimit(Ratelimit.slidingWindow(200, '1 h'))
  if (ratelimit) {
    const { remaining } = await ratelimit.limit(request.ip || '127.0.0.1')
    if (!remaining) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  const { searchParams } = new URL(request.url)
  const result = schema.safeParse(Object.fromEntries(searchParams))

  if (!result.success) {
    return NextResponse.json(JSON.parse(result.error.message), { status: 400 })
  }

  const args = result.data

  const approval = args.isApproved
    ? ({
        token0: { status: 'APPROVED' },
        token1: { status: 'APPROVED' },
      } as const)
    : {}

  const client = await createClient()
  const data = await client.sushiPool
    .findMany({
      select: {
        address: true,
      },
      where: {
        chainId: args.chainId,
        protocol: args.protocol,
        ...approval,
      },
    })
    .then((pools) => pools.map((pool) => pool.address))
  await client.$disconnect()

  return NextResponse.json(data, { headers: CORS })
}

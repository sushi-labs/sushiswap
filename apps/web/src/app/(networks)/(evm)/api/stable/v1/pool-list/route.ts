import {
  type PoolChainId,
  getPoolAddresses,
  isPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { Ratelimit } from '@upstash/ratelimit'
import { ipAddress } from '@vercel/functions'
import { type NextRequest, NextResponse } from 'next/server'
import {
  type SushiSwapCmsProtocol,
  SushiSwapCmsProtocols,
} from 'src/lib/constants'
import { rateLimit } from 'src/lib/rate-limit'
import * as z from 'zod'
import { CORS } from '../../cors'

const schema = z.object({
  chainId: z.coerce
    .number()
    .refine((chainId) => isPoolChainId(chainId), {
      message: 'Invalid chainId',
    })
    .transform((chainId) => {
      return chainId as PoolChainId
    }),
  protocol: z
    .string()
    .refine(
      (protocol) =>
        SushiSwapCmsProtocols.includes(protocol as SushiSwapCmsProtocol),
      {
        message: `Invalid protocol, valid values are: ${Object.values(
          SushiSwapCmsProtocols,
        ).join(', ')}`,
      },
    )
    .transform((protocol) => protocol as SushiSwapCmsProtocol),
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
export const maxDuration = 30

export async function GET(request: NextRequest) {
  const ratelimit = rateLimit(Ratelimit.slidingWindow(200, '1 h'))
  if (ratelimit) {
    const { remaining } = await ratelimit.limit(
      ipAddress(request) || '127.0.0.1',
    )
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

  const data = await getPoolAddresses({
    chainId: args.chainId,
    protocols: [args.protocol],
  })

  return NextResponse.json(data, { headers: CORS })
}

import { getCache } from '@vercel/functions'
import { checkBotId } from 'botid/server'
import { getRpcHeaders, getRpcUrl } from 'src/lib/rpc'
import { z } from 'zod'

export const preferredRegion = ['iad1', 'fra1', 'hkg1']

const rpcEnvelope = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number().finite(), z.null()]),
})
const blockNumberRequest = rpcEnvelope.extend({
  method: z.literal('eth_blockNumber'),
  params: z.tuple([]).optional(),
})
const blockNumberResponse = rpcEnvelope.extend({
  result: z.string().regex(/^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/),
  error: z.never().optional(),
})

const cachedBlockNumber = blockNumberResponse.pick({ result: true }).extend({
  expiresAt: z.number(),
})
const blockNumbers = getCache({ namespace: 'rpc-block-number-v1' })

export async function POST(
  request: Request,
  { params }: { params: Promise<{ network: string }> },
): Promise<Response> {
  const { network } = await params
  if (!/^[a-z0-9-]+$/.test(network)) {
    return Response.json({ error: 'Invalid network' }, { status: 400 })
  }

  try {
    const { isBot } = await checkBotId({
      advancedOptions: { checkLevel: 'basic' },
    })
    if (isBot) {
      return Response.json(
        { error: 'Bot verification failed' },
        { status: 403 },
      )
    }
  } catch {
    return Response.json(
      { error: 'Bot verification unavailable' },
      { status: 503 },
    )
  }

  if (!process.env.DRPC_ID) {
    return Response.json({ error: 'RPC unavailable' }, { status: 503 })
  }

  try {
    const body = await request.arrayBuffer()
    const rpcRequest = blockNumberRequest.safeParse(
      await new Response(body).json().catch(() => null),
    )
    if (rpcRequest.success) {
      const cached = cachedBlockNumber.safeParse(
        await blockNumbers.get(network).catch(() => null),
      )
      if (cached.success && cached.data.expiresAt > Date.now()) {
        return Response.json(
          {
            jsonrpc: '2.0',
            id: rpcRequest.data.id,
            result: cached.data.result,
          },
          { headers: { 'Cache-Control': 'no-store' } },
        )
      }
    }

    const now = Date.now()
    const response = await fetch(getRpcUrl(network), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getRpcHeaders() },
      body,
      cache: 'no-store',
      redirect: 'error',
      signal: request.signal,
    })

    if (rpcRequest.success && response.ok) {
      const rpcResponse = blockNumberResponse.safeParse(
        await response
          .clone()
          .json()
          .catch(() => null),
      )
      if (rpcResponse.success && rpcResponse.data.id === rpcRequest.data.id) {
        await blockNumbers
          .set(
            network,
            { result: rpcResponse.data.result, expiresAt: now + 1_000 },
            { ttl: 1 },
          )
          .catch(() => undefined)
      }
    }

    const headers = new Headers({ 'Cache-Control': 'no-store' })
    for (const name of ['Content-Type', 'Retry-After']) {
      const value = response.headers.get(name)
      if (value) headers.set(name, value)
    }

    return new Response(response.body, { status: response.status, headers })
  } catch {
    return Response.json({ error: 'RPC unavailable' }, { status: 502 })
  }
}

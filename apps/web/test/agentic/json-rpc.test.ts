import { describe, expect, it, vi } from 'vitest'
import {
  JsonRpcError,
  createHttpJsonRpcTransport,
  fromHexQuantity,
  toHexQuantity,
} from './json-rpc'

describe('JSON-RPC transport', () => {
  it('validates ids and returns the result', async () => {
    const request = vi.fn(
      async (_input: string | URL | Request, init?: RequestInit) => {
        const body = JSON.parse(String(init?.body)) as { id: number }
        return new Response(
          JSON.stringify({ id: body.id, jsonrpc: '2.0', result: '0x2a' }),
        )
      },
    )
    const transport = createHttpJsonRpcTransport({
      fetch: request,
      url: 'http://rpc.invalid',
    })
    await expect(transport('eth_blockNumber')).resolves.toBe('0x2a')
  })

  it('surfaces JSON-RPC errors', async () => {
    const transport = createHttpJsonRpcTransport({
      fetch: async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as { id: number }
        return new Response(
          JSON.stringify({
            error: { code: -32_000, message: 'reverted' },
            id: body.id,
            jsonrpc: '2.0',
          }),
        )
      },
      url: 'http://rpc.invalid',
    })
    await expect(transport('eth_call')).rejects.toBeInstanceOf(JsonRpcError)
  })

  it('round trips hex quantities', () => {
    expect(fromHexQuantity(toHexQuantity(123n))).toBe(123n)
  })
})

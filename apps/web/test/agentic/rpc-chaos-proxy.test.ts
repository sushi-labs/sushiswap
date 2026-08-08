import { describe, expect, it } from 'vitest'
import { startRpcChaosProxy } from './rpc-chaos-proxy'

describe.skipIf(process.env.AGENTIC_RUN_PROXY_INTEGRATION !== 'true')(
  'RPC chaos proxy',
  () => {
    it('injects deterministic wrong ids after forwarding the request', async () => {
      const proxy = await startRpcChaosProxy({
        fetch: async (_input, init) => {
          const body = JSON.parse(String(init?.body)) as { id: number }
          return Response.json({ id: body.id, jsonrpc: '2.0', result: '0x1' })
        },
        port: 0,
        profile: {
          rules: [
            {
              activateOn: 1,
              duration: 1,
              id: 'wrong-block-id',
              kind: 'wrong-id',
              methods: ['eth_blockNumber'],
            },
          ],
          seed: 1,
        },
        targetRpcUrl: 'http://rpc.invalid',
      })

      try {
        const response = await rpc(proxy.url, 'eth_blockNumber')
        expect(response).toMatchObject({ id: 2, result: '0x1' })
        const replayed = await rpc(proxy.url, 'eth_blockNumber')
        expect(replayed).toMatchObject({ id: 1, result: '0x1' })
      } finally {
        await proxy.close()
      }
    })

    it('can hide a bounded receipt without dropping other RPC methods', async () => {
      const proxy = await startRpcChaosProxy({
        fetch: async (_input, init) => {
          const body = JSON.parse(String(init?.body)) as { id: number }
          return Response.json({
            id: body.id,
            jsonrpc: '2.0',
            result: { status: '0x1' },
          })
        },
        port: 0,
        profile: {
          rules: [
            {
              activateOn: 1,
              duration: 1,
              id: 'temporarily-missing-receipt',
              kind: 'drop-receipt',
              methods: ['eth_getTransactionReceipt'],
            },
          ],
          seed: 2,
        },
        targetRpcUrl: 'http://rpc.invalid',
      })

      try {
        expect(await rpc(proxy.url, 'eth_getTransactionReceipt')).toMatchObject(
          {
            result: null,
          },
        )
        expect(await rpc(proxy.url, 'eth_chainId')).toMatchObject({
          result: { status: '0x1' },
        })
      } finally {
        await proxy.close()
      }
    })
  },
)

async function rpc(url: string, method: string): Promise<unknown> {
  const response = await fetch(url, {
    body: JSON.stringify({ id: 1, jsonrpc: '2.0', method, params: [] }),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  })
  return response.json()
}

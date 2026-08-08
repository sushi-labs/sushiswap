import type { EvmAddress } from 'sushi/evm'
import type { Hex } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import type {
  ForkController,
  ForkMetadata,
  ForkSnapshotId,
} from './fork-controller'
import type { JsonValue } from './json-rpc'
import { startSwapApiProxy } from './swap-api-proxy'
import type { TestedChainId } from './tested-chains'

const sender = '0x0000000000000000000000000000000000000001'
const router = '0x0000000000000000000000000000000000000002'
const native = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

describe.skipIf(process.env.AGENTIC_RUN_PROXY_INTEGRATION !== 'true')(
  'Swap API proxy',
  () => {
    it('forwards with simulate=false and returns the unchanged successful route', async () => {
      const controller = new FakeForkController({ type: 'CALL' })
      const upstream = vi.fn(async (input: string | URL | Request) => {
        const url = new URL(String(input))
        expect(url.searchParams.get('simulate')).toBe('false')
        return Response.json(upstreamSwap())
      })
      const artifacts: unknown[] = []
      const proxy = await startSwapApiProxy({
        controller,
        fetch: upstream,
        onArtifact(artifact) {
          artifacts.push(artifact)
        },
        port: 0,
        productionApiBaseUrl: 'https://api.invalid',
      })

      try {
        const response = await fetch(swapUrl(proxy.url))
        expect(response.status).toBe(200)
        expect(await response.json()).toEqual(upstreamSwap())
        expect(response.headers.get('x-agentic-classification')).toBe('success')
        expect(artifacts).toHaveLength(1)
      } finally {
        await proxy.close()
      }
    })

    it('maps a narrow local revert classification without changing the upstream route', async () => {
      const controller = new FakeForkController({
        error: 'execution reverted',
        revertReason: 'Too little received',
      })
      const proxy = await startSwapApiProxy({
        controller,
        fetch: async () => Response.json(upstreamSwap()),
        port: 0,
        productionApiBaseUrl: 'https://api.invalid',
      })

      try {
        const response = await fetch(swapUrl(proxy.url))
        expect(response.status).toBe(422)
        expect(response.headers.get('x-agentic-classification')).toBe(
          'minimum-output-violation',
        )
        expect(await response.json()).toMatchObject({
          code: 'MINIMUM_OUTPUT_VIOLATION',
          status: 'SimulationFailed',
        })
      } finally {
        await proxy.close()
      }
    })
  },
)

class FakeForkController implements ForkController {
  readonly backend = 'anvil' as const
  readonly chainId = 1 as TestedChainId
  readonly metadata: ForkMetadata = {
    backend: 'anvil',
    chainId: this.chainId,
    forkBlockNumber: 1n,
    forkId: 'fake',
    publicRpcUrl: 'http://rpc.invalid',
    startedAt: new Date(0).toISOString(),
  }
  readonly mutations = []

  constructor(private readonly trace: unknown) {}

  async create(): Promise<ForkMetadata> {
    return this.metadata
  }

  async destroy(): Promise<void> {}
  async impersonate(_address: EvmAddress): Promise<void> {}
  async mine(_blocks?: number): Promise<void> {}

  async requestAdmin<T>(
    method: string,
    _params?: readonly JsonValue[],
  ): Promise<T> {
    if (method === 'eth_getBalance') return '0xffffffffffffffff' as T
    if (method === 'debug_traceCall') return this.trace as T
    throw new Error(`Unexpected RPC method ${method}`)
  }

  async revert(_snapshotId: ForkSnapshotId): Promise<void> {}

  async setErc20Balance(
    _token: EvmAddress,
    _account: EvmAddress,
    _amount: bigint,
  ): Promise<boolean> {
    return false
  }

  async setNativeBalance(
    _account: EvmAddress,
    _amount: bigint,
  ): Promise<void> {}

  async snapshot(): Promise<ForkSnapshotId> {
    return '0x1'
  }

  async stopImpersonating(_address: EvmAddress): Promise<void> {}
}

function upstreamSwap(): Readonly<Record<string, unknown>> {
  return {
    assumedAmountOut: '100',
    status: 'Success',
    tx: {
      data: '0x' as Hex,
      from: sender,
      gas: '21000',
      gasPrice: 1,
      to: router,
      value: '1000',
    },
  }
}

function swapUrl(proxyUrl: string): string {
  const url = new URL('/swap/v7/1', proxyUrl)
  url.searchParams.set('amount', '1000')
  url.searchParams.set('sender', sender)
  url.searchParams.set('simulate', 'true')
  url.searchParams.set('tokenIn', native)
  url.searchParams.set('tokenOut', router)
  return url.toString()
}

import { test as base } from '@playwright/test'
import type { Hex } from 'viem'
import {
  createForkControllerFromEnvironment,
  faultProfileFromEnvironment,
  productionSwapApiBaseUrl,
} from './controller-factory'
import type { ForkController, ForkSnapshotId } from './fork-controller'
import { createHttpJsonRpcTransport, isRecord } from './json-rpc'
import type { RpcExchangeArtifact } from './rpc-chaos-proxy'
import { startRpcChaosProxy } from './rpc-chaos-proxy'
import type { SwapProxyArtifact } from './swap-api-proxy'
import { startSwapApiProxy } from './swap-api-proxy'
import type { TestedChainId } from './tested-chains'

export interface AgenticHarness {
  readonly controller: ForkController
  readonly rpcExchanges: RpcExchangeArtifact[]
  readonly swapArtifacts: SwapProxyArtifact[]
  readonly transactionHashes: Hex[]
}

interface TestFixtures {
  readonly scenarioSnapshot: ForkSnapshotId
}

interface WorkerFixtures {
  readonly agenticHarness: AgenticHarness
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  agenticHarness: [
    async ({ browserName: _browserName }, use, workerInfo) => {
      const chainId = workerInfo.project.metadata.chainId
      if (typeof chainId !== 'number') {
        throw new Error(
          'Agentic Playwright project has no numeric chainId metadata',
        )
      }

      const controller = createForkControllerFromEnvironment(
        chainId as TestedChainId,
        workerInfo.workerIndex,
      )
      const metadata = await controller.create()
      const rpcExchanges: RpcExchangeArtifact[] = []
      const swapArtifacts: SwapProxyArtifact[] = []
      const transactionHashes: Hex[] = []
      const seed = Number(process.env.AGENTIC_SEED ?? 1)

      const browserProxy = await startRpcChaosProxy({
        onExchange(artifact) {
          rpcExchanges.push(artifact)
          collectTransactionHashes(artifact, transactionHashes)
        },
        port: Number(process.env.AGENTIC_BROWSER_RPC_PORT ?? 9545),
        profile: faultProfileFromEnvironment('browser', seed),
        targetRpcUrl: metadata.publicRpcUrl,
      })
      const simulationProxy = await startRpcChaosProxy({
        port: Number(process.env.AGENTIC_SIMULATION_RPC_PORT ?? 9550),
        profile: faultProfileFromEnvironment('simulation', seed),
        targetRpcUrl: metadata.publicRpcUrl,
      })
      const swapProxy = await startSwapApiProxy({
        controller,
        onArtifact(artifact) {
          swapArtifacts.push(artifact)
        },
        port: Number(process.env.AGENTIC_SWAP_API_PORT ?? 9650),
        productionApiBaseUrl: productionSwapApiBaseUrl(),
        simulationTransport: createHttpJsonRpcTransport({
          timeoutMs: 120_000,
          url: simulationProxy.url,
        }),
      })

      try {
        await use({
          controller,
          rpcExchanges,
          swapArtifacts,
          transactionHashes,
        })
      } finally {
        await Promise.allSettled([
          swapProxy.close(),
          simulationProxy.close(),
          browserProxy.close(),
        ])
        await controller.destroy()
      }
    },
    { scope: 'worker' },
  ],
  scenarioSnapshot: async ({ agenticHarness }, use, testInfo) => {
    const snapshot = await agenticHarness.controller.snapshot()
    const mutationStart = agenticHarness.controller.mutations.length
    const rpcStart = agenticHarness.rpcExchanges.length
    const swapStart = agenticHarness.swapArtifacts.length
    const transactionStart = agenticHarness.transactionHashes.length
    try {
      await use(snapshot)
    } finally {
      await testInfo.attach('agentic-run.json', {
        body: Buffer.from(
          JSON.stringify(
            {
              fork: agenticHarness.controller.metadata,
              mutations:
                agenticHarness.controller.mutations.slice(mutationStart),
              rpcExchanges: agenticHarness.rpcExchanges.slice(rpcStart),
              seed: Number(process.env.AGENTIC_SEED ?? 1),
              swapArtifacts: agenticHarness.swapArtifacts.slice(swapStart),
              transactionHashes:
                agenticHarness.transactionHashes.slice(transactionStart),
            },
            bigintReplacer,
            2,
          ),
        ),
        contentType: 'application/json',
      })
      await agenticHarness.controller.revert(snapshot)
    }
  },
})

export { expect } from '@playwright/test'

function collectTransactionHashes(
  artifact: RpcExchangeArtifact,
  hashes: Hex[],
): void {
  const requests = Array.isArray(artifact.request)
    ? artifact.request
    : [artifact.request]
  const responses = Array.isArray(artifact.response)
    ? artifact.response
    : [artifact.response]

  requests.forEach((request, index) => {
    const response = responses[index]
    if (
      request.method === 'eth_sendTransaction' &&
      isRecord(response) &&
      typeof response.result === 'string' &&
      /^0x[0-9a-f]{64}$/i.test(response.result)
    ) {
      hashes.push(response.result as Hex)
    }
  })
}

function bigintReplacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value
}

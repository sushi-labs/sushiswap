import { API_BASE_URL } from 'sushi/evm'
import { AnvilForkController } from './anvil-fork-controller'
import type { ForkController } from './fork-controller'
import type { RpcFaultProfile } from './rpc-chaos'
import { TenderlyForkController } from './tenderly-fork-controller'
import type { TestedChainId } from './tested-chains'

export function createForkControllerFromEnvironment(
  chainId: TestedChainId,
  workerIndex: number,
): ForkController {
  const backend = process.env.AGENTIC_FORK_BACKEND ?? 'anvil'
  const forkBlockNumber = process.env.AGENTIC_FORK_BLOCK_NUMBER
    ? BigInt(process.env.AGENTIC_FORK_BLOCK_NUMBER)
    : undefined

  if (backend === 'anvil') {
    const forkUrl =
      process.env[`AGENTIC_FORK_URL_${chainId}`] ?? process.env.AGENTIC_FORK_URL
    if (!forkUrl) {
      throw new Error(
        `Missing AGENTIC_FORK_URL_${chainId} (or AGENTIC_FORK_URL) for Anvil`,
      )
    }
    return new AnvilForkController({
      chainId,
      forkBlockNumber,
      forkUrl,
      port: Number(process.env.AGENTIC_ANVIL_PORT_BASE ?? 9750) + workerIndex,
    })
  }

  if (backend === 'tenderly') {
    const accessKey = process.env.TENDERLY_ACCESS_KEY
    const accountSlug = process.env.TENDERLY_ACCOUNT_SLUG
    const projectSlug = process.env.TENDERLY_PROJECT_SLUG
    if (!accessKey || !accountSlug || !projectSlug) {
      throw new Error(
        'Tenderly requires TENDERLY_ACCESS_KEY, TENDERLY_ACCOUNT_SLUG, and TENDERLY_PROJECT_SLUG',
      )
    }
    const runId = process.env.AGENTIC_RUN_ID ?? `${Date.now()}`
    return new TenderlyForkController({
      accessKey,
      accountSlug,
      chainId,
      displayName: `Sushi agentic ${chainId} ${runId}`,
      forkBlockNumber,
      projectSlug,
      slug: `sushi-agentic-${chainId}-${runId}-${workerIndex}`,
    })
  }

  throw new Error(`Unknown agentic fork backend: ${backend}`)
}

export function productionSwapApiBaseUrl(): string {
  return process.env.AGENTIC_PRODUCTION_API_BASE_URL ?? API_BASE_URL
}

export function faultProfileFromEnvironment(
  name: 'browser' | 'simulation',
  seed: number,
): RpcFaultProfile {
  const key = `AGENTIC_${name.toUpperCase()}_RPC_FAULTS`
  const value = process.env[key]
  if (!value) return { rules: [], seed }

  const parsed: unknown = JSON.parse(value)
  if (!Array.isArray(parsed)) {
    throw new Error(`${key} must be a JSON array of fault rules`)
  }
  return { rules: parsed as RpcFaultProfile['rules'], seed }
}

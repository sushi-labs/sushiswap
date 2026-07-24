import type { EvmAddress } from 'sushi/evm'
import type { ForkMetadata } from './fork-controller'
import { RpcForkController } from './fork-controller'
import {
  type JsonRpcTransport,
  createHttpJsonRpcTransport,
  isRecord,
  toHexQuantity,
} from './json-rpc'
import type { TestedChainId } from './tested-chains'

export interface TenderlyForkControllerOptions {
  readonly accessKey: string
  readonly accountSlug: string
  readonly chainId: TestedChainId
  readonly displayName: string
  readonly fetch?: typeof fetch
  readonly forkBlockNumber?: bigint
  readonly projectSlug: string
  readonly slug: string
}

interface TenderlyRpc {
  readonly name: string
  readonly url: string
}

interface TenderlyVnet {
  readonly id: string
  readonly rpcs: readonly TenderlyRpc[]
}

interface TenderlyEnvironment {
  readonly activeInstanceId: string
  readonly environmentId: string
  readonly vnet: TenderlyVnet
}

export class TenderlyForkController extends RpcForkController {
  readonly backend = 'tenderly' as const
  readonly chainId: TestedChainId
  metadata: ForkMetadata | undefined
  protected adminTransport: JsonRpcTransport | undefined

  private readonly options: TenderlyForkControllerOptions
  private readonly fetchImplementation: typeof fetch
  private environment: TenderlyEnvironment | undefined

  constructor(options: TenderlyForkControllerOptions) {
    super()
    this.options = options
    this.chainId = options.chainId
    this.fetchImplementation = options.fetch ?? fetch
  }

  async create(): Promise<ForkMetadata> {
    if (this.metadata) return this.metadata

    const response = await this.fetchImplementation(
      `${this.apiBaseUrl}/environments`,
      {
        body: JSON.stringify({
          display_name: this.options.displayName,
          network_configs: [
            {
              block_number: this.options.forkBlockNumber
                ? toHexQuantity(this.options.forkBlockNumber)
                : 'latest',
              chain_config_overrides: {
                chain_id: String(this.chainId),
              },
              explorer_config: {
                enabled: false,
                verification_visibility: 'bytecode',
              },
              network_id: String(this.chainId),
            },
          ],
          slug: this.options.slug,
        }),
        headers: this.apiHeaders,
        method: 'POST',
      },
    )
    if (!response.ok) {
      throw new Error(
        `Tenderly environment creation failed with HTTP ${response.status}: ${await response.text()}`,
      )
    }

    this.environment = parseTenderlyEnvironment(await response.json())
    const adminRpcUrl = findRpc(this.environment.vnet, 'admin')
    const publicRpcUrl = findRpc(this.environment.vnet, 'public')
    this.adminTransport = createHttpJsonRpcTransport({
      fetch: this.fetchImplementation,
      headers: { 'x-access-key': this.options.accessKey },
      timeoutMs: 120_000,
      url: adminRpcUrl,
    })

    this.metadata = {
      backend: this.backend,
      chainId: this.chainId,
      dashboardUrl: `https://dashboard.tenderly.co/${this.options.accountSlug}/${this.options.projectSlug}/virtual-testnets/${this.environment.environmentId}`,
      forkBlockNumber: await this.readForkBlockNumber(),
      forkId: this.environment.environmentId,
      publicRpcUrl,
      startedAt: new Date().toISOString(),
    }
    return this.metadata
  }

  async destroy(): Promise<void> {
    const environment = this.environment
    this.environment = undefined
    this.adminTransport = undefined
    this.metadata = undefined
    if (!environment) return

    const response = await this.fetchImplementation(
      `${this.apiBaseUrl}/environments/${environment.environmentId}`,
      {
        headers: this.apiHeaders,
        method: 'DELETE',
      },
    )
    if (!response.ok && response.status !== 404) {
      throw new Error(
        `Tenderly environment deletion failed with HTTP ${response.status}: ${await response.text()}`,
      )
    }
  }

  async setErc20Balance(
    token: EvmAddress,
    account: EvmAddress,
    amount: bigint,
  ): Promise<boolean> {
    await this.requestAdmin<unknown>('tenderly_setErc20Balance', [
      token,
      account,
      toHexQuantity(amount),
    ])
    return true
  }

  protected get impersonateMethod(): string {
    return 'tenderly_impersonateAccount'
  }

  protected get mineMethod(): string {
    return 'evm_increaseBlocks'
  }

  protected get nativeBalanceMethod(): string {
    return 'tenderly_setBalance'
  }

  protected get stopImpersonatingMethod(): string {
    return 'tenderly_stopImpersonatingAccount'
  }

  private get apiBaseUrl(): string {
    return `https://api.tenderly.co/api/public/v1/account/${this.options.accountSlug}/project/${this.options.projectSlug}`
  }

  private get apiHeaders(): Readonly<Record<string, string>> {
    return {
      'content-type': 'application/json',
      'x-access-key': this.options.accessKey,
    }
  }
}

function parseTenderlyEnvironment(value: unknown): TenderlyEnvironment {
  if (!isRecord(value) || typeof value.id !== 'string') {
    throw new Error('Tenderly returned an invalid environment')
  }

  const activeInstance = value.active_instance
  if (!isRecord(activeInstance) || typeof activeInstance.id !== 'string') {
    throw new Error('Tenderly environment has no active instance')
  }

  const vnets = activeInstance.vnets
  if (!Array.isArray(vnets) || vnets.length !== 1) {
    throw new Error('Tenderly environment must contain exactly one network')
  }

  const candidate: unknown = vnets[0]
  if (!isRecord(candidate) || typeof candidate.id !== 'string') {
    throw new Error('Tenderly environment returned an invalid network')
  }

  if (!Array.isArray(candidate.rpcs)) {
    throw new Error('Tenderly network has no RPC endpoints')
  }

  const rpcs: TenderlyRpc[] = candidate.rpcs.map((rpc) => {
    if (
      !isRecord(rpc) ||
      typeof rpc.name !== 'string' ||
      typeof rpc.url !== 'string'
    ) {
      throw new Error('Tenderly network returned an invalid RPC endpoint')
    }
    return { name: rpc.name, url: rpc.url }
  })

  return {
    activeInstanceId: activeInstance.id,
    environmentId: value.id,
    vnet: { id: candidate.id, rpcs },
  }
}

function findRpc(vnet: TenderlyVnet, kind: 'admin' | 'public'): string {
  const rpc = vnet.rpcs.find(({ name }) => name.toLowerCase().includes(kind))
  if (!rpc) throw new Error(`Tenderly network has no ${kind} RPC endpoint`)
  return rpc.url
}

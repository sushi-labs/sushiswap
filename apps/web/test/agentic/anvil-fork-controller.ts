import { type Anvil, type CreateAnvilOptions, createAnvil } from '@viem/anvil'
import { type ForkMetadata, RpcForkController } from './fork-controller'
import { type JsonRpcTransport, createHttpJsonRpcTransport } from './json-rpc'
import type { TestedChainId } from './tested-chains'

export interface AnvilForkControllerOptions {
  readonly chainId: TestedChainId
  readonly forkBlockNumber?: bigint
  readonly forkUrl: string
  readonly host?: string
  readonly port: number
}

export class AnvilForkController extends RpcForkController {
  readonly backend = 'anvil' as const
  readonly chainId: TestedChainId
  metadata: ForkMetadata | undefined
  protected adminTransport: JsonRpcTransport | undefined

  private anvil: Anvil | undefined
  private readonly options: AnvilForkControllerOptions

  constructor(options: AnvilForkControllerOptions) {
    super()
    this.options = options
    this.chainId = options.chainId
  }

  async create(): Promise<ForkMetadata> {
    if (this.metadata) return this.metadata

    const createOptions: CreateAnvilOptions = {
      accounts: 20,
      balance: 10_000,
      chainId: this.chainId,
      forkBlockNumber: this.options.forkBlockNumber,
      forkUrl: this.options.forkUrl,
      host: this.options.host ?? '127.0.0.1',
      port: this.options.port,
      stepsTracing: true,
      timeout: 120_000,
    }
    const anvil = createAnvil(createOptions)
    await anvil.start()
    this.anvil = anvil

    const rpcUrl = `http://${anvil.host}:${anvil.port}`
    this.adminTransport = createHttpJsonRpcTransport({
      timeoutMs: 120_000,
      url: rpcUrl,
    })

    const actualChainId = Number(await this.requestAdmin<string>('eth_chainId'))
    if (actualChainId !== this.chainId) {
      await this.destroy()
      throw new Error(
        `Anvil fork chain mismatch: expected ${this.chainId}, received ${actualChainId}`,
      )
    }

    this.metadata = {
      backend: this.backend,
      chainId: this.chainId,
      forkBlockNumber: await this.readForkBlockNumber(),
      forkId: `anvil-${this.chainId}-${this.options.port}`,
      publicRpcUrl: rpcUrl,
      startedAt: new Date().toISOString(),
    }
    return this.metadata
  }

  async destroy(): Promise<void> {
    const anvil = this.anvil
    this.anvil = undefined
    this.adminTransport = undefined
    this.metadata = undefined
    await anvil?.stop()
  }
}

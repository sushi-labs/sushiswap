import type { EvmAddress } from 'sushi/evm'
import type { Hex } from 'viem'
import {
  type JsonRpcTransport,
  type JsonValue,
  fromHexQuantity,
  toHexQuantity,
} from './json-rpc'
import type { TestedChainId } from './tested-chains'

export type ForkBackend = 'anvil' | 'tenderly'
export type ForkSnapshotId = Hex

export interface ForkMetadata {
  readonly backend: ForkBackend
  readonly chainId: TestedChainId
  readonly dashboardUrl?: string
  readonly forkBlockNumber: bigint
  readonly forkId: string
  readonly publicRpcUrl: string
  readonly startedAt: string
}

export interface ForkMutation {
  readonly method: string
  readonly params: readonly JsonValue[]
  readonly timestamp: string
}

export interface ForkController {
  readonly backend: ForkBackend
  readonly chainId: TestedChainId
  readonly metadata: ForkMetadata | undefined
  readonly mutations: readonly ForkMutation[]
  create(): Promise<ForkMetadata>
  destroy(): Promise<void>
  impersonate(address: EvmAddress): Promise<void>
  mine(blocks?: number): Promise<void>
  requestAdmin<T>(method: string, params?: readonly JsonValue[]): Promise<T>
  revert(snapshotId: ForkSnapshotId): Promise<void>
  setErc20Balance(
    token: EvmAddress,
    account: EvmAddress,
    amount: bigint,
  ): Promise<boolean>
  setNativeBalance(account: EvmAddress, amount: bigint): Promise<void>
  snapshot(): Promise<ForkSnapshotId>
  stopImpersonating(address: EvmAddress): Promise<void>
}

export abstract class RpcForkController implements ForkController {
  abstract readonly backend: ForkBackend
  abstract readonly chainId: TestedChainId
  abstract metadata: ForkMetadata | undefined
  protected abstract adminTransport: JsonRpcTransport | undefined
  private readonly mutationRecords: ForkMutation[] = []

  get mutations(): readonly ForkMutation[] {
    return this.mutationRecords
  }

  abstract create(): Promise<ForkMetadata>
  abstract destroy(): Promise<void>

  async requestAdmin<T>(
    method: string,
    params: readonly JsonValue[] = [],
  ): Promise<T> {
    if (!this.adminTransport) {
      throw new Error(`${this.backend} fork has not been created`)
    }

    const result = await this.adminTransport<T>(method, params)
    if (isMutationMethod(method)) {
      this.mutationRecords.push({
        method,
        params,
        timestamp: new Date().toISOString(),
      })
    }
    return result
  }

  async snapshot(): Promise<ForkSnapshotId> {
    return this.requestAdmin<ForkSnapshotId>('evm_snapshot')
  }

  async revert(snapshotId: ForkSnapshotId): Promise<void> {
    const reverted = await this.requestAdmin<boolean>('evm_revert', [
      snapshotId,
    ])
    if (!reverted)
      throw new Error(`Failed to revert fork snapshot ${snapshotId}`)
  }

  async setNativeBalance(account: EvmAddress, amount: bigint): Promise<void> {
    await this.requestAdmin<unknown>(this.nativeBalanceMethod, [
      account,
      toHexQuantity(amount),
    ])
  }

  async impersonate(address: EvmAddress): Promise<void> {
    await this.requestAdmin<unknown>(this.impersonateMethod, [address])
  }

  async stopImpersonating(address: EvmAddress): Promise<void> {
    await this.requestAdmin<unknown>(this.stopImpersonatingMethod, [address])
  }

  async mine(blocks = 1): Promise<void> {
    if (!Number.isSafeInteger(blocks) || blocks < 1) {
      throw new Error(`Invalid block count: ${blocks}`)
    }

    await this.requestAdmin<unknown>(this.mineMethod, [toHexQuantity(blocks)])
  }

  async setErc20Balance(
    _token: EvmAddress,
    _account: EvmAddress,
    _amount: bigint,
  ): Promise<boolean> {
    return false
  }

  protected async readForkBlockNumber(): Promise<bigint> {
    const blockNumber = await this.requestAdmin<string>('eth_blockNumber')
    return fromHexQuantity(blockNumber)
  }

  protected get impersonateMethod(): string {
    return 'anvil_impersonateAccount'
  }

  protected get mineMethod(): string {
    return 'anvil_mine'
  }

  protected get nativeBalanceMethod(): string {
    return 'anvil_setBalance'
  }

  protected get stopImpersonatingMethod(): string {
    return 'anvil_stopImpersonatingAccount'
  }
}

function isMutationMethod(method: string): boolean {
  return (
    method.startsWith('anvil_') ||
    method.startsWith('tenderly_') ||
    method.startsWith('evm_') ||
    method === 'eth_sendRawTransaction' ||
    method === 'eth_sendTransaction'
  )
}

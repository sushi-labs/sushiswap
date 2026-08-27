import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { SvmAddress, SvmTxHash } from 'sushi/svm'
import type { Hex } from 'viem'

/** A framework-independent view of a Privy embedded EVM wallet. */
export interface PrivyEvmWallet {
  address: EvmAddress
}

/** A framework-independent view of a Privy embedded Solana wallet. */
export interface PrivySvmWallet {
  address: SvmAddress
}

export interface PrivyTransactionUiOptions {
  buttonText?: string
  description?: string
  isCancellable?: boolean
  showWalletUIs?: boolean
  successDescription?: string
  successHeader?: string
}

export interface PrivyEvmTransactionRequest {
  chainId: number
  data?: Hex
  to: EvmAddress
  value?: bigint
}

/**
 * Operations implemented by the lazily loaded Privy runtime. Keeping these
 * handlers in the external store lets application consumers avoid importing
 * Privy's React context.
 */
export interface PrivyRuntimeOperationHandlers {
  connectOrCreateEvmWallet(): Promise<void>
  exportEvmWallet(address: EvmAddress): Promise<void>
  exportSvmWallet(address: SvmAddress): Promise<void>
  loginSvm(): Promise<void>
  logout(): Promise<void>
  sendEvmTransaction(input: {
    address: EvmAddress
    transaction: PrivyEvmTransactionRequest
    uiOptions?: PrivyTransactionUiOptions
  }): Promise<{ hash: EvmTxHash }>
  signAndSendSvmTransaction(input: {
    address: SvmAddress
    transaction: Uint8Array
    uiOptions?: PrivyTransactionUiOptions
  }): Promise<{ signature: SvmTxHash }>
}

interface PrivyRuntimeEmptySnapshot {
  authenticated?: never
  error?: never
  evmWallet?: never
  operations?: never
  svmWallet?: never
}

interface PrivyRuntimeUnrequestedSnapshot extends PrivyRuntimeEmptySnapshot {
  evmReconnect: false
  requested: false
  status: 'unavailable'
}

interface PrivyRuntimeRequestedSnapshotBase {
  /** Remains true while a persisted Privy EVM connection is being restored. */
  evmReconnect: boolean
  requested: true
}

interface PrivyRuntimeInactiveSnapshot
  extends PrivyRuntimeRequestedSnapshotBase,
    PrivyRuntimeEmptySnapshot {
  status: 'unavailable' | 'loading'
}

interface PrivyRuntimeErrorSnapshot extends PrivyRuntimeRequestedSnapshotBase {
  authenticated?: never
  error: Error
  evmWallet?: never
  operations?: never
  status: 'error'
  svmWallet?: never
}

interface PrivyRuntimeReadySnapshotBase
  extends PrivyRuntimeRequestedSnapshotBase {
  error?: never
  operations: PrivyRuntimeOperationHandlers
  status: 'ready'
}

interface PrivyRuntimeAuthenticatedSnapshot
  extends PrivyRuntimeReadySnapshotBase {
  authenticated: true
  evmWallet: PrivyEvmWallet | null
  /**
   * Whether the user's Privy account already holds an embedded wallet for the
   * namespace, read from `user.linkedAccounts`. Privy rejects `createWallet()`
   * for a user who has one, and the wallet lists surface later than the
   * account does, so provisioning must key off this rather than off a null
   * wallet.
   */
  hasEvmAccount: boolean
  hasSvmAccount: boolean
  svmWallet: PrivySvmWallet | null
}

interface PrivyRuntimeUnauthenticatedSnapshot
  extends PrivyRuntimeReadySnapshotBase {
  authenticated: false
  evmWallet: null
  hasEvmAccount?: never
  hasSvmAccount?: never
  svmWallet: null
}

export type PrivyRuntimeReadySnapshot =
  | PrivyRuntimeAuthenticatedSnapshot
  | PrivyRuntimeUnauthenticatedSnapshot

export type PrivyRuntimeSnapshot =
  | PrivyRuntimeUnrequestedSnapshot
  | PrivyRuntimeInactiveSnapshot
  | PrivyRuntimeErrorSnapshot
  | PrivyRuntimeReadySnapshot

export type PrivyRuntimePublication =
  | {
      authenticated: false
      evmWallet?: never
      hasEvmAccount?: never
      hasSvmAccount?: never
      operations: PrivyRuntimeOperationHandlers
      svmWallet?: never
    }
  | {
      authenticated: true
      evmWallet?: PrivyEvmWallet | null
      hasEvmAccount: boolean
      hasSvmAccount: boolean
      operations: PrivyRuntimeOperationHandlers
      svmWallet?: PrivySvmWallet | null
    }

export type PrivyRuntimeListener = (
  snapshot: PrivyRuntimeSnapshot,
  previousSnapshot: PrivyRuntimeSnapshot,
) => void

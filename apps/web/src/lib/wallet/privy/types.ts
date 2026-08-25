import type { Wallet as StandardWallet } from '@wallet-standard/base'
import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { SvmAddress, SvmTxHash } from 'sushi/svm'
import type { EIP1193Provider, Hex } from 'viem'

/** A lazily resolved Privy EVM wallet capability. */
export interface PrivyEvmWallet {
  address: EvmAddress
  getProvider(): Promise<EIP1193Provider>
}

/** A framework-independent view of Privy's Wallet Standard wallet. */
export interface PrivySvmWallet {
  address: SvmAddress
  standardWallet: StandardWallet
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
  signSvmTransaction(input: {
    address: SvmAddress
    transaction: Uint8Array
  }): Promise<{ signedTransaction: Uint8Array }>
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
  svmWallet: PrivySvmWallet | null
}

interface PrivyRuntimeUnauthenticatedSnapshot
  extends PrivyRuntimeReadySnapshotBase {
  authenticated: false
  evmWallet: null
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
      operations: PrivyRuntimeOperationHandlers
      svmWallet?: never
    }
  | {
      authenticated: true
      evmWallet?: PrivyEvmWallet | null
      operations: PrivyRuntimeOperationHandlers
      svmWallet?: PrivySvmWallet | null
    }

export type PrivyRuntimeListener = (
  snapshot: PrivyRuntimeSnapshot,
  previousSnapshot: PrivyRuntimeSnapshot,
) => void

import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { SvmAddress, SvmTxHash } from 'sushi/svm'
import type { EIP1193Provider, Hex } from 'viem'

/** A framework-independent view of a Privy embedded EVM wallet. */
export interface PrivyEvmWallet {
  address: EvmAddress
  getEthereumProvider(): Promise<EIP1193Provider>
  switchChain(chainId: number): Promise<void>
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
  signSvmTransaction(input: {
    address: SvmAddress
    transaction: Uint8Array
  }): Promise<{ signedTransaction: Uint8Array }>
  signAndSendSvmTransaction(input: {
    address: SvmAddress
    transaction: Uint8Array
    uiOptions?: PrivyTransactionUiOptions
  }): Promise<{ signature: SvmTxHash }>
}

interface PrivyRuntimeSnapshotBase {
  hostMounted: boolean
  revision: number
}

interface PrivyRuntimeEmptySnapshot {
  authenticated?: never
  error?: never
  evmWallet?: never
  operations?: never
  svmWallet?: never
  walletsReady?: never
}

interface PrivyRuntimeUnrequestedSnapshot
  extends PrivyRuntimeSnapshotBase,
    PrivyRuntimeEmptySnapshot {
  requested: false
  status: 'unavailable'
}

interface PrivyRuntimeInactiveSnapshot
  extends PrivyRuntimeSnapshotBase,
    PrivyRuntimeEmptySnapshot {
  requested: true
  status: 'unavailable' | 'loading'
}

interface PrivyRuntimeErrorSnapshot extends PrivyRuntimeSnapshotBase {
  authenticated?: never
  error: Error
  evmWallet?: never
  operations?: never
  requested: true
  status: 'error'
  svmWallet?: never
  walletsReady?: never
}

interface PrivyRuntimeReadySnapshotBase extends PrivyRuntimeSnapshotBase {
  error?: never
  operations: PrivyRuntimeOperationHandlers
  requested: true
  status: 'ready'
  walletsReady: boolean
}

interface PrivyRuntimeAuthenticatedSnapshot
  extends PrivyRuntimeReadySnapshotBase {
  authenticated: true
  evmWallet: PrivyEvmWallet | null
  /** Whether linked-account state already contains an embedded wallet. */
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
      walletsReady: boolean
    }
  | {
      authenticated: true
      evmWallet?: PrivyEvmWallet | null
      hasEvmAccount: boolean
      hasSvmAccount: boolean
      operations: PrivyRuntimeOperationHandlers
      svmWallet?: PrivySvmWallet | null
      walletsReady: boolean
    }

export type PrivyRuntimeListener = (
  snapshot: PrivyRuntimeSnapshot,
  previousSnapshot: PrivyRuntimeSnapshot,
) => void

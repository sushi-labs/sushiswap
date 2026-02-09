import type { EvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'

export type WalletNamespace = 'evm' | 'svm' // | 'mvm'

export type WalletNamespaceFor<TChainId extends EvmChainId | SvmChainId> =
  TChainId extends EvmChainId
    ? 'evm'
    : TChainId extends SvmChainId
      ? 'svm'
      : never

export type ChainIdForNamespace<TNamespace extends WalletNamespace> =
  TNamespace extends 'evm'
    ? EvmChainId
    : TNamespace extends 'svm'
      ? SvmChainId
      : never

export interface Wallet {
  id: string
  namespace: WalletNamespace
  name: string
  icon: string
  adapterId: string
  url?: string
  uid?: string
}

export interface WalletConnectorConfig {
  recommended: Wallet[]
  other: Wallet[]
  all: Wallet[]
}

export interface WalletWithState extends Wallet {
  isInstalled: boolean
  isAvailable: boolean
  isRecent: boolean
}

export interface WalletConnection<
  TChainId extends EvmChainId | SvmChainId = EvmChainId | SvmChainId,
> {
  id: string
  name: string
  namespace: WalletNamespaceFor<TChainId>
  account: AddressFor<TChainId>
  icon?: string
  chainId: TChainId
}

export interface NamespaceContext<TChainId extends EvmChainId | SvmChainId> {
  isConnected: boolean
  account: AddressFor<TChainId> | undefined
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet?: Wallet) => Promise<void>
}

export type WalletConnectAction = 'connect' | 'switch' | 'select-namespace'

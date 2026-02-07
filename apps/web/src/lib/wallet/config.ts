import { ChainId } from 'sushi'
import type { WalletNamespace } from './types'

export const DEFAULT_CHAIN_ID_BY_NAMESPACE: Record<WalletNamespace, ChainId> = {
  evm: ChainId.ETHEREUM,
  svm: ChainId.SOLANA,
}

export const ENABLED_WALLET_NAMESPACES: WalletNamespace[] = ['evm', 'svm']
export const isWalletNamespaceEnabled = (namespace: WalletNamespace) =>
  ENABLED_WALLET_NAMESPACES.includes(namespace)

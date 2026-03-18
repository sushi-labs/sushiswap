import { ChainId } from 'sushi'
import type { WalletNamespace } from './types'

export const DEFAULT_CHAIN_ID_BY_NAMESPACE: Record<WalletNamespace, ChainId> = {
  evm: ChainId.ETHEREUM,
  svm: ChainId.SOLANA,
  stellar: ChainId.STELLAR,
}

export const ENABLED_WALLET_NAMESPACES: WalletNamespace[] = [
  'evm',
  'svm',
  'stellar',
]
export const isWalletNamespaceEnabled = (namespace: WalletNamespace) =>
  ENABLED_WALLET_NAMESPACES.includes(namespace)

export const getNameFromNamespace = (namespace: WalletNamespace) => {
  switch (namespace) {
    case 'evm':
      return 'EVM'
    case 'svm':
      return 'Solana'
    case 'stellar':
      return 'Stellar'
    default:
      return namespace
  }
}

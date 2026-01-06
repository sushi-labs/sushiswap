import { ChainId } from 'sushi'
import type { WalletNamespace } from './types'

export const DEFAULT_CHAIN_ID_BY_NAMESPACE: Record<WalletNamespace, ChainId> = {
  evm: ChainId.ETHEREUM,
  svm: -1, // TODO
}

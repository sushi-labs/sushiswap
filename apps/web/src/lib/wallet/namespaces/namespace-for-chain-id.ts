import type { EvmChainId } from 'sushi/evm'
import { type SvmChainId, isSvmChainId } from 'sushi/svm'
import type { WalletNamespaceFor } from '../types'

export function getNamespaceForChainId<
  TChainId extends EvmChainId | SvmChainId,
>(chainId: TChainId): WalletNamespaceFor<TChainId> {
  if (isSvmChainId(chainId)) {
    return 'svm' as WalletNamespaceFor<TChainId>
  }
  return 'evm' as WalletNamespaceFor<TChainId>
}

import type { EvmChainId } from 'sushi/evm'
import { type StellarChainId, isStellarChainId } from 'sushi/stellar'
import { type SvmChainId, isSvmChainId } from 'sushi/svm'
import type { WalletNamespaceFor } from '../types'

export function getNamespaceForChainId<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
>(chainId: TChainId): WalletNamespaceFor<TChainId> {
  if (isStellarChainId(chainId)) {
    return 'stellar' as WalletNamespaceFor<TChainId>
  }
  if (isSvmChainId(chainId)) {
    return 'svm' as WalletNamespaceFor<TChainId>
  }
  return 'evm' as WalletNamespaceFor<TChainId>
}

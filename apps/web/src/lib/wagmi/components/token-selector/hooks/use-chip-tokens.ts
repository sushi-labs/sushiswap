import { useMemo } from 'react'
import { EVM_DEFAULT_BASES, type EvmChainId, isEvmChainId } from 'sushi/evm'
import {
  STELLAR_DEFAULT_BASES,
  type StellarChainId,
  isStellarChainId,
} from 'sushi/stellar'
import { SVM_DEFAULT_BASES, type SvmChainId, isSvmChainId } from 'sushi/svm'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'

interface UseChipTokens<TChainId extends BalanceChainId> {
  chainId: TChainId
  includeNative?: boolean
  showPinnedTokens?: boolean
}

// TODO: Add pinned tokens

export function useChipTokens<TChainId extends BalanceChainId>({
  chainId,
  includeNative = true,
  // showPinnedTokens = true,
}: UseChipTokens<TChainId>) {
  const defaultBases = useMemo(() => {
    if (isEvmChainId(chainId)) {
      return EVM_DEFAULT_BASES[chainId]
    }
    if (isSvmChainId(chainId)) {
      return SVM_DEFAULT_BASES[chainId]
    }
    if (isStellarChainId(chainId)) {
      return STELLAR_DEFAULT_BASES[chainId]
    }

    throw new Error('Unsupported chainId')
  }, [chainId])

  // const {} = usePinnedTokens()

  return useMemo(() => {
    return defaultBases.flatMap((base) => {
      if (base.type === 'native' && !includeNative) return []

      return {
        default: true,
        token: base as CurrencyFor<TChainId>,
      }
    })
  }, [includeNative, defaultBases])
}

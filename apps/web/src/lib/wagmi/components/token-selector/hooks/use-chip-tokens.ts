import { useMemo } from 'react'
import { EVM_DEFAULT_BASES, isEvmChainId } from 'sushi/evm'
import { STELLAR_DEFAULT_BASES, isStellarChainId } from 'sushi/stellar'
import { SVM_DEFAULT_BASES, isSvmChainId } from 'sushi/svm'
import type { TokenSelectorChainId } from '../config'

interface UseChipTokens<TChainId extends TokenSelectorChainId> {
  chainId: TChainId
  includeNative?: boolean
  showPinnedTokens?: boolean
}

// TODO: Add pinned tokens

export function useChipTokens<TChainId extends TokenSelectorChainId>({
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
  }, [chainId]) as Readonly<CurrencyFor<TChainId>[]>

  // const {} = usePinnedTokens()

  return useMemo(() => {
    return defaultBases.flatMap((base) => {
      if (base.type === 'native' && !includeNative) return []

      return {
        default: true,
        token: base,
      }
    })
  }, [includeNative, defaultBases])
}

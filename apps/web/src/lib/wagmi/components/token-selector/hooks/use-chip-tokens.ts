import { useMemo } from 'react'
import { EVM_DEFAULT_BASES, type EvmChainId, isEvmChainId } from 'sushi/evm'
import { SVM_DEFAULT_BASES, type SvmChainId, isSvmChainId } from 'sushi/svm'

interface UseChipTokens<TChainId extends EvmChainId | SvmChainId> {
  chainId: TChainId
  includeNative?: boolean
  showPinnedTokens?: boolean
}

// TODO: Add pinned tokens

export function useChipTokens<TChainId extends EvmChainId | SvmChainId>({
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

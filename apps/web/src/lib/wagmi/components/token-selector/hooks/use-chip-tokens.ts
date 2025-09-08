import { useMemo } from 'react'
import { EVM_DEFAULT_BASES, type EvmChainId } from 'sushi/evm'

interface UseChipTokens {
  chainId: EvmChainId
  includeNative?: boolean
  showPinnedTokens?: boolean
}

// TODO: Add pinned tokens

export function useChipTokens({
  chainId,
  includeNative = true,
  // showPinnedTokens = true,
}: UseChipTokens) {
  const defaultBases = EVM_DEFAULT_BASES[chainId]

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

// import { usePinnedTokens } from '@sushiswap/hooks'
import { useMemo } from 'react'
import type { ChainId } from 'sushi/chain'
import { DEFAULT_BASES } from 'sushi/config'

interface UseChipTokens {
  chainId: ChainId
  includeNative?: boolean
  showPinnedTokens?: boolean
}

// TODO: Add pinned tokens

export function useChipTokens({
  chainId,
  includeNative = true,
  // showPinnedTokens = true,
}: UseChipTokens) {
  const defaultBases = DEFAULT_BASES[chainId]

  // const {} = usePinnedTokens()

  return useMemo(() => {
    return defaultBases.flatMap((base) => {
      if (base.isNative && !includeNative) return []

      return {
        default: true,
        token: base,
      }
    })
  }, [includeNative, defaultBases])
}

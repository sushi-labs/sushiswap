// import { usePinnedTokens } from '@sushiswap/hooks'
import { useMemo } from 'react'
import type { EvmChainId } from 'sushi/chain'
import { EVM_DEFAULT_BASES } from 'sushi/config'

interface UseChipTokens {
  chainId: EvmChainId | EvmChainId[]
  includeNative?: boolean
  showPinnedTokens?: boolean
}

// TODO: Add pinned tokens

export function useChipTokens({
  chainId,
  includeNative = true,
}: // showPinnedTokens = true,
UseChipTokens) {
  const defaultBases = useMemo(() => {
    if (!Array.isArray(chainId)) {
      return EVM_DEFAULT_BASES[chainId]
    }
    return chainId.flatMap((id) => EVM_DEFAULT_BASES[id] || [])
  }, [chainId])

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

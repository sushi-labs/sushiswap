'use client'

import { createContext, useContext } from 'react'
import type { UnifiedSwapChainId } from './unified-swap'

export interface UnifiedSwapState {
  chainId0: UnifiedSwapChainId
  chainId1: UnifiedSwapChainId
  token0Param: string | undefined
  token1Param: string | undefined
  swapAmountString: string
  setAmount(amount: string): void
  selectToken(
    side: 'INPUT' | 'OUTPUT',
    chainId: number,
    tokenParam: string,
  ): void
  selectPair(chainId: UnifiedSwapChainId, token0: string, token1: string): void
  switchTokens(): void
}

export const UnifiedSwapContext = createContext<UnifiedSwapState | null>(null)

export function useUnifiedSwap(): UnifiedSwapState | null {
  return useContext(UnifiedSwapContext)
}

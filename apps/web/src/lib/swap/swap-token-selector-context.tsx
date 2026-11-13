'use client'

import {
  type ComponentType,
  type ReactNode,
  createContext,
  useContext,
} from 'react'

import type { TokenSelectorChainId } from 'src/lib/wagmi/components/token-selector/config'

export interface SwapTokenSelectorProps {
  side: 'INPUT' | 'OUTPUT'
  children: ReactNode
  currency?: CurrencyFor<TokenSelectorChainId>
}

export const SwapTokenSelectorContext =
  createContext<ComponentType<SwapTokenSelectorProps> | null>(null)

export function useSwapTokenSelector(): ComponentType<SwapTokenSelectorProps> | null {
  return useContext(SwapTokenSelectorContext)
}

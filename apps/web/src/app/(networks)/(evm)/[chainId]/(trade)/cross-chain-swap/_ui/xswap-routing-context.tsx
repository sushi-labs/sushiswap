'use client'

import { createContext, useContext, useEffect } from 'react'
import type { CrossChainProvider } from 'src/lib/swap/cross-chain/route-availability'

export type WidgetMode = CrossChainProvider | 'unsupported'

export const XSwapRoutingContext = createContext<WidgetMode>('unsupported')
export const XSwapRoutingLockContext = createContext<
  (provider: WidgetMode | undefined) => void
>(() => {})

export function useXSwapRouting(): WidgetMode {
  return useContext(XSwapRoutingContext)
}

export function useXSwapRoutingLock(
  provider: WidgetMode,
  active: boolean,
): void {
  const lock = useContext(XSwapRoutingLockContext)
  useEffect(() => {
    if (!active) return
    lock(provider)
    return () => lock(undefined)
  }, [lock, provider, active])
}

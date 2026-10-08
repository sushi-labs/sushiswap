'use client'

import { type ReactNode, useState } from 'react'
import { isLifiXSwapSupportedChainId } from 'src/config'
import {
  type RouteAvailability,
  canTryNextProvider,
  getPreferredProvider,
} from 'src/lib/swap/cross-chain/route-availability'
import { LayerZeroXSwapProvider } from './layerzero/xswap-provider'
import { useLifiXSwap, useLifiXSwapTradeRoutes } from './lifi/xswap-provider'
import {
  NearIntentsXSwapProvider,
  useNearIntentsXSwap,
} from './near-intents/xswap-provider'
import { useXSwapForm } from './xswap-form-provider'
import {
  XSwapRoutingContext,
  XSwapRoutingLockContext,
} from './xswap-routing-context'

export function XSwapRoutingProvider({
  children,
}: { children: ReactNode }): ReactNode {
  const form = useXSwapForm()
  const {
    state: { swapAmount, token0, token1 },
    isLoading,
  } = useLifiXSwap()
  const supported =
    isLifiXSwapSupportedChainId(form.chainId0) &&
    (!form.chainId1 || isLifiXSwapSupportedChainId(form.chainId1))
  const routes = useLifiXSwapTradeRoutes({ enabled: supported })
  const lifi: RouteAvailability = !supported
    ? 'unsupported'
    : !swapAmount?.gt(0n) || !token0 || !token1
      ? isLoading
        ? 'loading'
        : 'idle'
      : routes.isError
        ? 'error'
        : routes.isSuccess
          ? routes.data.length > 0
            ? 'available'
            : 'empty'
          : 'loading'

  return (
    <NearIntentsXSwapProvider enabled={canTryNextProvider(lifi)}>
      <ValueTransferFallback lifi={lifi}>{children}</ValueTransferFallback>
    </NearIntentsXSwapProvider>
  )
}

function ValueTransferFallback({
  children,
  lifi,
}: {
  children: ReactNode
  lifi: RouteAvailability
}): ReactNode {
  const { routeAvailability } = useNearIntentsXSwap()
  const [lockedProvider, setLockedProvider] = useState<
    'lifi' | 'near-intents' | 'layerzero' | 'unsupported'
  >()
  const mode = lockedProvider ?? getPreferredProvider(lifi, routeAvailability)
  return (
    <XSwapRoutingLockContext.Provider value={setLockedProvider}>
      <XSwapRoutingContext.Provider value={mode}>
        <LayerZeroXSwapProvider enabled={mode === 'layerzero'}>
          {children}
        </LayerZeroXSwapProvider>
      </XSwapRoutingContext.Provider>
    </XSwapRoutingLockContext.Provider>
  )
}

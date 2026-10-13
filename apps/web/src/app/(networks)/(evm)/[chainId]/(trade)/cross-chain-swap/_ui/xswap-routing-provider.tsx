'use client'

import { type ReactNode, useState } from 'react'
import { isLifiXSwapSupportedChainId } from 'src/config'
import {
  type RouteAvailability,
  canTryNextProvider,
  getPreferredProvider,
} from 'src/lib/swap/cross-chain/route-availability'
import { isValueTransferHypeRoute } from 'src/lib/swap/value-transfer/hype-route'
import { LayerZeroXSwapProvider } from './layerzero/xswap-provider'
import { useLifiXSwap, useLifiXSwapTradeRoutes } from './lifi/xswap-provider'
import {
  NearIntentsXSwapProvider,
  useNearIntentsXSwap,
} from './near-intents/xswap-provider'
import { useXSwapForm } from './xswap-form-provider'
import {
  type WidgetMode,
  XSwapRoutingContext,
  XSwapRoutingLockContext,
} from './xswap-routing-context'

export function XSwapRoutingProvider({
  children,
}: { children: ReactNode }): ReactNode {
  const form = useXSwapForm()
  const preferValueTransfer = isValueTransferHypeRoute(form)
  const {
    state: { swapAmount, token0, token1 },
    isLoading,
  } = useLifiXSwap()
  const supported =
    isLifiXSwapSupportedChainId(form.chainId0) &&
    (!form.chainId1 || isLifiXSwapSupportedChainId(form.chainId1))
  const routes = useLifiXSwapTradeRoutes({
    enabled: supported && !preferValueTransfer,
  })
  let lifi: RouteAvailability
  if (!supported) {
    lifi = 'unsupported'
  } else if (!swapAmount?.gt(0n) || !token0 || !token1) {
    lifi = isLoading ? 'loading' : 'idle'
  } else if (routes.isError) {
    lifi = 'error'
  } else if (routes.isSuccess) {
    lifi = routes.data.length > 0 ? 'available' : 'empty'
  } else {
    lifi = 'loading'
  }

  return (
    <NearIntentsXSwapProvider
      enabled={!preferValueTransfer && canTryNextProvider(lifi)}
    >
      <ValueTransferFallback
        lifi={lifi}
        preferValueTransfer={preferValueTransfer}
      >
        {children}
      </ValueTransferFallback>
    </NearIntentsXSwapProvider>
  )
}

function ValueTransferFallback({
  children,
  lifi,
  preferValueTransfer,
}: {
  children: ReactNode
  lifi: RouteAvailability
  preferValueTransfer: boolean
}): ReactNode {
  const { routeAvailability } = useNearIntentsXSwap()
  const [lockedProvider, setLockedProvider] = useState<WidgetMode>()
  const mode =
    lockedProvider ??
    (preferValueTransfer
      ? 'layerzero'
      : getPreferredProvider(lifi, routeAvailability))
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

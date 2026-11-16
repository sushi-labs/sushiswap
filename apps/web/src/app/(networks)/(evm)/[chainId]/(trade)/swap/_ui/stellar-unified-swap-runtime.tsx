'use client'

import type { ReactElement } from 'react'
import type { SwapEdgeConfig } from '~stellar/_common/lib/edge/get-swap-edge-config'
import { EdgeProvider } from '~stellar/_common/providers/edge-config-provider'
import { SimpleSwapProvider } from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { SimpleSwapWidget } from '~stellar/_common/ui/swap/simple/simple-swap-widget'
import { Providers as StellarWalletProvider } from '~stellar/providers'

export function StellarUnifiedSwapRuntime({
  config,
}: { config: SwapEdgeConfig }): ReactElement {
  return (
    <StellarWalletProvider>
      <EdgeProvider config={config}>
        <SimpleSwapProvider>
          <SimpleSwapWidget />
        </SimpleSwapProvider>
      </EdgeProvider>
    </StellarWalletProvider>
  )
}

'use client'

import { Module, Partners, SpotProvider } from '@orbs-network/spot-react'
import { Container } from '@sushiswap/ui'
import { useConnection, useWalletClient } from 'wagmi'
import { SwapModeButtons } from '../../_ui/swap-mode-buttons'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { OrbsBanner } from '../_ui/orbs-banner'
import { TwapOrdersDialogTriggerButton } from '../_ui/twap-orders-dialog'

export default function SwapLimitPage() {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()
  const { address } = useConnection()
  const { data: wallet } = useWalletClient({ chainId })

  return (
    <Container maxWidth="lg" className="relative">
      <SpotProvider
        partner={Partners.Sushiswap}
        module={Module.LIMIT}
        priceProtection={0}
        minChunkSizeUsd={0}
        typedInputAmount=""
        marketReferencePrice={{ isLoading: false, noLiquidity: false }}
        chainId={chainId}
        account={address}
        provider={wallet?.transport}
      >
        <div className="flex flex-col gap-4 p-4 md:p-6 bg-white/80 dark:bg-slate-900/80 rounded-3xl">
          <SwapModeButtons />
          <h1 className="text-xl font-semibold">Limit (Legacy — Orbs)</h1>
          <p className="text-sm text-muted-foreground">
            View and cancel your existing Orbs limit orders. New limit orders
            use CoW Protocol. DCA, stop-loss and take-profit orders continue to
            use Orbs.
          </p>
          <TwapOrdersDialogTriggerButton />
          <OrbsBanner />
        </div>
      </SpotProvider>
    </Container>
  )
}

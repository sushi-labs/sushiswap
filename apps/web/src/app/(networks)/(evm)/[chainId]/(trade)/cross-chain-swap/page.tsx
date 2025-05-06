'use client'

import { Container, classNames } from '@sushiswap/ui'
import { CrossChainSwapRouteSelector } from 'src/ui/swap/cross-chain/cross-chain-swap-route-selector'
import { CrossChainSwapWidget } from 'src/ui/swap/cross-chain/cross-chain-swap-widget'
import { useCrossChainTradeRoutes } from 'src/ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'

export default function CrossChainSwapPage() {
  const { isLoading, isFetched } = useCrossChainTradeRoutes()
  const showRouteSelector = isLoading || isFetched

  return (
    <div className={classNames('flex justify-center flex-wrap gap-y-4 h-full')}>
      <Container maxWidth="lg" className="px-4 !mx-[unset]">
        <CrossChainSwapWidget />
      </Container>
      {showRouteSelector ? (
        <Container maxWidth="lg" className="px-4 !mx-[unset] flex items-center">
          <CrossChainSwapRouteSelector />
        </Container>
      ) : null}
    </div>
  )
}

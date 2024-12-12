'use client'

import { Container, classNames } from '@sushiswap/ui'
import { CrossChainRouteSelector } from 'src/ui/swap/cross-chain/cross-chain-route-selector'
import { CrossChainSwapWidget } from 'src/ui/swap/cross-chain/cross-chain-swap-widget'
import { useCrossChainTradeRoutes } from 'src/ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'

export default function CrossChainSwapPage() {
  const { data: routes, isLoading } = useCrossChainTradeRoutes()
  const showRouteSelector = isLoading || (routes && routes.length > 0)

  return (
    <div
      className={classNames(
        'flex flex-wrap justify-center items-end',
        showRouteSelector ? 'ml-56' : '',
      )}
    >
      <Container maxWidth="lg" className={classNames('px-4 !mx-[unset]')}>
        <CrossChainSwapWidget />
      </Container>
      {showRouteSelector ? (
        <CrossChainRouteSelector routes={routes} isLoading={isLoading} />
      ) : null}
    </div>
  )
}

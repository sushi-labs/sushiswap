'use client'

import { Container, classNames } from '@sushiswap/ui'
import { CrossChainSwapRouteSelector } from 'src/ui/swap/cross-chain/cross-chain-swap-route-selector'
import { CrossChainSwapWidget } from 'src/ui/swap/cross-chain/cross-chain-swap-widget'
import { useCrossChainTradeRoutes } from 'src/ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector';
import { XSWAP_SUPPORTED_CHAIN_IDS } from 'src/config';

export default function CrossChainSwapPage() {
  useHeaderNetworkSelector(XSWAP_SUPPORTED_CHAIN_IDS);
  const { isLoading, isFetched } = useCrossChainTradeRoutes()
  const showRouteSelector = isLoading || isFetched

  return (
    <div
      className={classNames(
        'flex justify-center flex-wrap gap-y-4 h-full'
      )}
    >
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

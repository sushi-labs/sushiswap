'use client'

import { Collapsible } from '@sushiswap/ui'
import { useTradeMode } from 'src/lib/hooks/useTradeMode'
import { QuickSelectOverlay } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-overlay'
import { EdgeProvider, useEdgeConfig } from 'src/providers/edge-config-provider'
import { DerivedStateTwapProvider } from '~evm/[chainId]/[trade]/_ui/twap/derivedstate-twap-provider'
import { DerivedstateCrossChainSwapProvider } from '~evm/[chainId]/[trade]/_ui/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { DerivedstateSimpleSwapProvider } from '../derivedstate-simple-swap-provider'
import { SimpleSwapSettingsOverlay } from '../simple-swap-settings-overlay'
import { useDerivedStateSimpleTrade } from './derivedstate-simple-trade-provider'
import { type TradeEdgeConfig, sliceEdgeConfig } from './trade-edge-config'
import { TradeModeButtons } from './trade-mode-buttons'
// import { FiatWidget } from './widgets/fiat'
import { MarketWidget } from './widgets/market'
import { DCAWidget, LimitWidget } from './widgets/twap'
import { Wrapper } from './wrapper'

export const TradeWidget = () => {
  const {
    state: { tradeModeChanged, chainId, tradeView },
  } = useDerivedStateSimpleTrade()
  const { tradeMode } = useTradeMode()

  const tradeEdge = useEdgeConfig<TradeEdgeConfig>()
  const modeEdge = sliceEdgeConfig(tradeEdge, tradeMode)

  return (
    <EdgeProvider config={modeEdge}>
      <Wrapper className="border relative md:border-none border-black/10">
        <QuickSelectOverlay />
        <Collapsible open={true} disabled={!tradeModeChanged}>
          <div className="flex flex-col gap-4">
            {tradeMode === 'swap' && (
              <DerivedstateCrossChainSwapProvider defaultChainId={chainId}>
                <DerivedstateSimpleSwapProvider>
                  <div className="flex items-center justify-between">
                    <TradeModeButtons />
                    <SimpleSwapSettingsOverlay />
                  </div>
                  <MarketWidget
                    isAdvanced={tradeView === 'advanced'}
                    animated={tradeModeChanged}
                  />
                </DerivedstateSimpleSwapProvider>
              </DerivedstateCrossChainSwapProvider>
            )}
            {tradeMode === 'limit' && (
              <DerivedStateTwapProvider isLimitOrder>
                <div className="flex items-center justify-between">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <LimitWidget animated={tradeModeChanged} />
              </DerivedStateTwapProvider>
            )}
            {tradeMode === 'dca' && (
              <DerivedStateTwapProvider>
                <div className="flex items-center justify-between">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <DCAWidget animated={tradeModeChanged} />
              </DerivedStateTwapProvider>
            )}
            {/* {tradeMode === 'fiat' && (
              <>
                <div className="flex items-center justify-between">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <FiatWidget animated={tradeModeChanged} />
              </>
            )} */}
          </div>
        </Collapsible>
      </Wrapper>
    </EdgeProvider>
  )
}

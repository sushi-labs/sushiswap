'use client'

import { Collapsible, classNames } from '@sushiswap/ui'
import { QuickSelectOverlay } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select'
import { useQuickSelectContext } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import { EdgeProvider, useEdgeConfig } from 'src/providers/edge-config-provider'
import { DerivedstateCrossChainSwapProvider } from 'src/ui/swap/cross-chain/derivedstate-cross-chain-swap-provider'
import { DerivedstateSimpleSwapProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay'
import { useDerivedStateSimpleTrade } from './derivedstate-simple-trade-provider'
import { type TradeEdgeConfig, sliceEdgeConfig } from './trade-edge-config'
import { TradeModeButtons } from './trade-mode-buttons'
import { CrossChainSwapWidget } from './widgets/cross-chain-swap'
import { SwapWidget } from './widgets/swap'
import { DCAWidget, LimitWidget } from './widgets/twap'
import { Wrapper } from './wrapper'

export const TradeWidget = () => {
  const {
    state: { tradeMode, chainId, tradeModeChanged },
  } = useDerivedStateSimpleTrade()

  const tradeEdge = useEdgeConfig<TradeEdgeConfig>()
  const modeEdge = sliceEdgeConfig(tradeEdge, tradeMode)

  return (
    <EdgeProvider config={modeEdge}>
      <Wrapper className={'relative'}>
        <QuickSelectOverlay />
        <Collapsible open={true} disabled={!tradeModeChanged}>
          <div className="flex flex-col gap-4">
            {tradeMode === 'swap' && (
              <DerivedstateSimpleSwapProvider>
                <div className="flex items-center justify-between">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <SwapWidget animated={tradeModeChanged} />
              </DerivedstateSimpleSwapProvider>
            )}
            {tradeMode === 'limit' && (
              <DerivedstateSimpleSwapProvider>
                <div className="flex items-center justify-between">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <LimitWidget animated={tradeModeChanged} />
              </DerivedstateSimpleSwapProvider>
            )}
            {tradeMode === 'dca' && (
              <DerivedstateSimpleSwapProvider>
                <div className="flex items-center justify-between">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <DCAWidget animated={tradeModeChanged} />
              </DerivedstateSimpleSwapProvider>
            )}
            {tradeMode === 'cross-chain-swap' && (
              <DerivedstateCrossChainSwapProvider defaultChainId={chainId}>
                <div className="flex items-center justify-between">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <CrossChainSwapWidget animated={tradeModeChanged} />
              </DerivedstateCrossChainSwapProvider>
            )}
          </div>
        </Collapsible>
      </Wrapper>
    </EdgeProvider>
  )
}

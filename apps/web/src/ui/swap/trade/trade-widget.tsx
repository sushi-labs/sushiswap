'use client'

import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay';
import { TradeModeButtons } from './trade-mode-buttons';
import { useDerivedStateSimpleTrade } from './derivedstate-simple-trade-provider';
import { DerivedstateSimpleSwapProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { DerivedstateCrossChainSwapProvider } from 'src/ui/swap/cross-chain/derivedstate-cross-chain-swap-provider';
import { EdgeProvider, useEdgeConfig } from 'src/providers/edge-config-provider';
import { sliceEdgeConfig, TradeEdgeConfig } from './trade-edge-config';
import { SwapWidget } from './widgets/swap';
import { DCAWidget, LimitWidget } from './widgets/twap';
import { CrossChainSwapWidget } from './widgets/cross-chain-swap';
import { Collapsible } from '@sushiswap/ui';

export const TradeWidget = () => {
  const { state: { tradeMode, chainId, tradeModeChanged } } = useDerivedStateSimpleTrade()
  const tradeEdge = useEdgeConfig<TradeEdgeConfig>()
  const modeEdge = sliceEdgeConfig(tradeEdge, tradeMode)

  return (
    <EdgeProvider config={modeEdge}>
      <div className="bg-slate-800 p-4 rounded-xl">
        <Collapsible open={true} disabled={!tradeModeChanged}>
          <div className="flex flex-col gap-4">
            {tradeMode === 'swap' && (
              <DerivedstateSimpleSwapProvider>
                <div className="flex items-center justify-between">
                  <TradeModeButtons/>
                  <SimpleSwapSettingsOverlay/>
                </div>
                <SwapWidget animated={tradeModeChanged}/>
              </DerivedstateSimpleSwapProvider>
            )}
            {tradeMode === 'limit' && (
              <DerivedstateSimpleSwapProvider>
                <div className="flex items-center justify-between">
                  <TradeModeButtons/>
                  <SimpleSwapSettingsOverlay/>
                </div>
                <LimitWidget animated={tradeModeChanged}/>
              </DerivedstateSimpleSwapProvider>
            )}
            {tradeMode === 'dca' && (
              <DerivedstateSimpleSwapProvider>
                <div className="flex items-center justify-between">
                  <TradeModeButtons/>
                  <SimpleSwapSettingsOverlay/>
                </div>
                <DCAWidget animated={tradeModeChanged}/>
              </DerivedstateSimpleSwapProvider>
            )}
            {tradeMode === 'cross-chain-swap' && (
              <DerivedstateCrossChainSwapProvider defaultChainId={chainId}>
                <div className="flex items-center justify-between">
                  <TradeModeButtons/>
                  <SimpleSwapSettingsOverlay/>
                </div>
                <CrossChainSwapWidget animated={tradeModeChanged}/>
              </DerivedstateCrossChainSwapProvider>
            )}
          </div>
        </Collapsible>
      </div>
    </EdgeProvider>
  )
}

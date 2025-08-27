'use client'

import { Collapsible, classNames } from '@sushiswap/ui'
import { usePathname } from 'next/navigation'
import { QuickSelectOverlay } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-overlay'
import { EdgeProvider, useEdgeConfig } from 'src/providers/edge-config-provider'
import { DerivedstateSimpleSwapProvider } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { DerivedstateCrossChainSwapProvider } from '../cross-chain/derivedstate-cross-chain-swap-provider'
import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay'
import { DerivedStateTwapProvider } from '../twap/derivedstate-twap-provider'
import { useDerivedStateSimpleTrade } from './derivedstate-simple-trade-provider'
import { type TradeEdgeConfig, sliceEdgeConfig } from './trade-edge-config'
import { TradeModeButtons } from './trade-mode-buttons'
import { FiatWidget } from './widgets/fiat'
import { MarketWidget } from './widgets/market'
import { DCAWidget, LimitWidget } from './widgets/twap'
import { Wrapper } from './wrapper'

export const TradeWidget = ({
  _tradeMode,
  wrapperClassName = '',
  tradeModeRowClassName = '',
}: {
  _tradeMode?: 'swap' | 'limit' | 'dca' | 'fiat'
  wrapperClassName?: string
  tradeModeRowClassName?: string
}) => {
  const {
    state: { tradeModeChanged, chainId, tradeView },
  } = useDerivedStateSimpleTrade()
  const pathname = usePathname()
  const tradeMode =
    _tradeMode ||
    (pathname.split('/')?.[2] as 'swap' | 'limit' | 'dca' | 'fiat')

  const tradeEdge = useEdgeConfig<TradeEdgeConfig>()
  const modeEdge = sliceEdgeConfig(tradeEdge, tradeMode)

  return (
    <EdgeProvider config={modeEdge}>
      <Wrapper
        className={classNames(
          'relative border md:border-none border-black/10',
          wrapperClassName,
        )}
      >
        <QuickSelectOverlay />
        <Collapsible open={true} disabled={!tradeModeChanged}>
          <div className="flex flex-col gap-4">
            {tradeMode === 'swap' && (
              <DerivedstateCrossChainSwapProvider defaultChainId={chainId}>
                <DerivedstateSimpleSwapProvider>
                  <div
                    className={classNames(
                      'flex justify-between items-center',
                      tradeModeRowClassName,
                    )}
                  >
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
                <div className="flex justify-between items-center">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <LimitWidget animated={tradeModeChanged} />
              </DerivedStateTwapProvider>
            )}
            {tradeMode === 'dca' && (
              <DerivedStateTwapProvider>
                <div className="flex justify-between items-center">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <DCAWidget animated={tradeModeChanged} />
              </DerivedStateTwapProvider>
            )}
            {tradeMode === 'fiat' && (
              <>
                <div className="flex justify-between items-center">
                  <TradeModeButtons />
                  <SimpleSwapSettingsOverlay />
                </div>
                <FiatWidget animated={tradeModeChanged} />
              </>
            )}
          </div>
        </Collapsible>
      </Wrapper>
    </EdgeProvider>
  )
}

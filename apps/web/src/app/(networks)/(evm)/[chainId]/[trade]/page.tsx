'use client'

import { useBreakpoint, useIsMounted, useIsSmScreen } from '@sushiswap/hooks'
import { Container, Loader, SkeletonBox } from '@sushiswap/ui'
import Script from 'next/script'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from 'public/static/charting_library/charting_library'
import React, { useEffect, useState } from 'react'
import type { NonStandardChainId } from 'src/config'
import { useSkaleEuropaFaucet } from 'src/lib/hooks'
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { Chart } from 'src/ui/swap/trade/chart/chart'
import { ChartHeader } from 'src/ui/swap/trade/chart/chart-header'
import { MobileChart } from 'src/ui/swap/trade/chart/mobile-chart'
import {
  CHAIN_IDS_BY_TRADE_MODE,
  type TradeMode,
} from 'src/ui/swap/trade/config'
import { useDerivedStateSimpleTrade } from 'src/ui/swap/trade/derivedstate-simple-trade-provider'
import { FavoriteRecentTabView } from 'src/ui/swap/trade/favorite-recent/favorite-recent-tab-view'
import { Search } from 'src/ui/swap/trade/search/search'
import { TradeTableTabs } from 'src/ui/swap/trade/tab-tables/trade-tabs/trade-table-tabs'
import { TradeViewSwitch } from 'src/ui/swap/trade/trade-view-switch'
import { TradeWidget } from 'src/ui/swap/trade/trade-widget'
import type { EvmChainId } from 'sushi/chain'

const chainIdsByTradeMode: Record<
  TradeMode,
  (EvmChainId | NonStandardChainId)[] | null
> = {
  ...(CHAIN_IDS_BY_TRADE_MODE as any),
  swap: null,
}

export default function TradePage() {
  const {
    state: { tradeMode, tradeView },
  } = useDerivedStateSimpleTrade()
  useHeaderNetworkSelector(chainIdsByTradeMode[tradeMode])
  useSkaleEuropaFaucet()
  const [isScriptReady, setIsScriptReady] = useState(false)
  const { isMd: isMdScreen } = useBreakpoint('md')
  const hasMounted = useIsMounted()

  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
    symbol: 'AAPL',
    interval: '1D' as ResolutionString,
    library_path: '/static/charting_library/',
    locale: 'en',
    charts_storage_url: 'https://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    fullscreen: false,
    autosize: true,
  }

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      <div className="bg-white dark:bg-background md:bg-background">
        <TradeViewSwitch />
        {tradeView === 'simple' && (
          <main className="lg:p-4 mt-16 mb-[86px] animate-slide">
            <Container maxWidth="lg" className="px-4">
              <TradeWidget />
            </Container>
          </main>
        )}
        {tradeView === 'advanced' && (
          <main className="lg:p-4 md:p-2 pt-9 md:mb-[86px] animate-slide bg-white dark:bg-background md:bg-background">
            <Container maxWidth="screen-2xl" className="px-4">
              <div className="flex flex-col-reverse w-full gap-4 md:flex-row">
                <div className="flex w-full flex-col gap-4 md:min-w-[calc(100%-480px)] md:w-full">
                  <div className="w-full md:h-[654px] flex flex-col md:p-5 md:gap-3">
                    {hasMounted && isScriptReady ? (
                      isMdScreen ? (
                        <>
                          <ChartHeader />
                          {/* <Chart widgetProps={defaultWidgetProps} /> */}
                        </>
                      ) : (
                        <MobileChart widgetProps={defaultWidgetProps} />
                      )
                    ) : !isMdScreen && hasMounted ? (
                      <SkeletonBox className="w-full h-[36px]" />
                    ) : null}
                  </div>
                  <div className="w-full md:h-[320px] pt-0 md:pt-4">
                    <TradeTableTabs />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 md:min-w-[480px] md:w-[480px]">
                  <Search />
                  <TradeWidget />
                  <FavoriteRecentTabView />
                </div>
              </div>
            </Container>
          </main>
        )}
      </div>
    </>
  )
}

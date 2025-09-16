'use client'

import { useBreakpoint, useIsMounted } from '@sushiswap/hooks'
import { Container, SkeletonBox, classNames } from '@sushiswap/ui'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from 'public/static/charting_library/charting_library'
import { useSkaleEuropaFaucet } from 'src/lib/hooks'
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'

import { ChainId } from 'sushi'
import { Chart } from './_ui/swap/trade/chart/chart'
import { ChartHeader } from './_ui/swap/trade/chart/chart-header'
import { ChartProvider } from './_ui/swap/trade/chart/chart-provider'
import { MobileChart } from './_ui/swap/trade/chart/mobile-chart'
import {
  CHAIN_IDS_BY_TRADE_MODE,
  type TradeMode,
} from './_ui/swap/trade/config'
import { useDerivedStateSimpleTrade } from './_ui/swap/trade/derivedstate-simple-trade-provider'
import { FavoriteRecentTabView } from './_ui/swap/trade/favorite-recent/favorite-recent-tab-view'
import { NetworkProvider } from './_ui/swap/trade/favorite-recent/network-provider'
import { Search } from './_ui/swap/trade/search/search'
import { TradeTableTabs } from './_ui/swap/trade/tab-tables/trade-tabs/trade-table-tabs'
import { TradeViewSwitch } from './_ui/swap/trade/trade-view-switch'
import { TradeWidget } from './_ui/swap/trade/trade-widget'

const chainIdsByTradeMode: Record<TradeMode, ChainId[] | null> = {
  ...(CHAIN_IDS_BY_TRADE_MODE as any),
  swap: null,
}

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
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

export default function TradePage() {
  const {
    state: { chainId, tradeMode, tradeView },
  } = useDerivedStateSimpleTrade()
  useHeaderNetworkSelector(chainIdsByTradeMode[tradeMode])
  useSkaleEuropaFaucet()
  const { isMd: isMdScreen } = useBreakpoint('md')
  const hasMounted = useIsMounted()
  const isKatana = chainId === ChainId.KATANA

  return (
    <>
      <div
        className={classNames(
          'dark:bg-background md:bg-background',
          isKatana
            ? '!bg-transparent'
            : tradeView === 'advanced'
              ? 'bg-white'
              : '',
        )}
      >
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
                    <ChartProvider>
                      {hasMounted ? (
                        isMdScreen ? (
                          <>
                            <ChartHeader />
                            <Chart widgetProps={defaultWidgetProps} />
                          </>
                        ) : (
                          <MobileChart widgetProps={defaultWidgetProps} />
                        )
                      ) : !isMdScreen && hasMounted ? (
                        <SkeletonBox className="w-full h-[36px]" />
                      ) : null}
                    </ChartProvider>
                  </div>
                  <div className="w-full md:h-[320px] pt-0 md:pt-4">
                    <TradeTableTabs />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 md:min-w-[480px] md:w-[480px]">
                  <NetworkProvider>
                    <Search />
                    <TradeWidget />
                    <FavoriteRecentTabView />
                  </NetworkProvider>
                </div>
              </div>
            </Container>
          </main>
        )}
      </div>
    </>
  )
}

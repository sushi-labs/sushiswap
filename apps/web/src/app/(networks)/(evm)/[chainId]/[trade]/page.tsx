'use client'

import { useBreakpoint, useIsMounted } from '@sushiswap/hooks'
import { Container, SkeletonBox, classNames } from '@sushiswap/ui'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from 'public/trading_view/charting_library/charting_library'
import { useSkaleEuropaFaucet } from 'src/lib/hooks'
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'

import { useMemo } from 'react'
import { ChainId } from 'sushi'
import { useAccount } from 'wagmi'
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

const chainIdsByTradeMode: Record<TradeMode, readonly ChainId[] | null> = {
  ...CHAIN_IDS_BY_TRADE_MODE,
  swap: null,
}

export default function TradePage() {
  const {
    state: { chainId, tradeMode, tradeView },
  } = useDerivedStateSimpleTrade()
  useHeaderNetworkSelector(chainIdsByTradeMode[tradeMode])
  useSkaleEuropaFaucet()
  const { isLg } = useBreakpoint('lg')
  const hasMounted = useIsMounted()

  const isKatana = chainId === ChainId.KATANA
  const { address } = useAccount()

  const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> =
    useMemo(() => {
      return {
        interval: '1D' as ResolutionString,
        library_path: '/trading_view/charting_library/',
        locale: 'en',
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: address ?? 'public_user_id',
        fullscreen: false,
        autosize: true,
      }
    }, [address])

  return (
    <>
      <div
        className={classNames(
          'dark:bg-background lg:bg-background',
          'mb-[56px]',
          isKatana
            ? '!bg-transparent'
            : tradeView === 'advanced'
              ? 'bg-white'
              : '',
        )}
      >
        <TradeViewSwitch />
        {tradeView === 'simple' && (
          <main className="md:p-4 mt-16 animate-slide">
            <Container maxWidth="lg" className="px-4">
              <TradeWidget />
            </Container>
          </main>
        )}
        {tradeView === 'advanced' && (
          <main className="xl:p-4 lg:p-2 pt-9 animate-slide dark:bg-background bg-background">
            <Container maxWidth="screen-2xl" className="px-4">
              <div className="flex flex-col-reverse w-full gap-4 lg:flex-row ">
                <div className="flex w-full flex-col gap-4 lg:min-w-[calc(100%-480px)] lg:w-full max-w-[480px] mx-auto">
                  <div className="w-full lg:h-[654px] flex flex-col lg:p-5 lg:gap-3">
                    <ChartProvider>
                      {hasMounted ? (
                        isLg ? (
                          <>
                            <ChartHeader />
                            <Chart widgetProps={defaultWidgetProps} />
                          </>
                        ) : (
                          <MobileChart widgetProps={defaultWidgetProps} />
                        )
                      ) : !isLg && hasMounted ? (
                        <SkeletonBox className="w-full h-[36px]" />
                      ) : null}
                    </ChartProvider>
                  </div>
                  <div className="w-full pt-0 lg:pt-4">
                    <TradeTableTabs />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 lg:min-w-[480px] lg:w-[480px] max-w-[480px] mx-auto">
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

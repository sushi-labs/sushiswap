'use client'

import { Container } from '@sushiswap/ui'
import React from 'react'
import type { NonStandardChainId } from 'src/config'
import { useSkaleEuropaFaucet } from 'src/lib/hooks'
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { Chart } from 'src/ui/swap/trade/chart/chart'
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

  return (
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
        <main className="lg:p-4 mt-9 md:mb-[86px] animate-slide bg-white dark:bg-background md:bg-background">
          <Container maxWidth="screen-2xl" className="px-4">
            <div className="flex flex-col-reverse w-full gap-4 md:flex-row">
              <div className="flex w-full flex-col gap-4 md:w-1/2 lg:w-[calc(100%-480px)]">
                <div className="w-full md:h-[648px] flex">
                  <Chart />
                </div>
                <div className="w-full md:h-[320px]">
                  <TradeTableTabs />
                </div>
              </div>
              <div className="flex w-full flex-col gap-4 md:w-[480px]">
                <Search />
                <TradeWidget />
                <FavoriteRecentTabView />
              </div>
            </div>
          </Container>
        </main>
      )}
    </div>
  )
}

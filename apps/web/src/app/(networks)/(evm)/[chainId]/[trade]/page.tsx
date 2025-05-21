'use client'

import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'
import type { NonStandardChainId } from 'src/config'
import { useSkaleEuropaFaucet } from 'src/lib/hooks'
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import {
  CHAIN_IDS_BY_TRADE_MODE,
  type TradeMode,
} from 'src/ui/swap/trade/config'
import { useDerivedStateSimpleTrade } from 'src/ui/swap/trade/derivedstate-simple-trade-provider'
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
    <>
      <TradeViewSwitch />
      {tradeView === 'simple' && (
        <main className="lg:p-4 mt-16 mb-[86px] animate-slide">
          <Container maxWidth="lg" className="px-4">
            <TradeWidget />
          </Container>
        </main>
      )}
      {tradeView === 'advanced' && (
        <main className="lg:p-4 mt-9 mb-[86px] animate-slide">
          <Container maxWidth="screen-2xl" className="px-4">
            <div className="flex-col-reverse md:flex-row flex w-full gap-4">
              <div className="flex w-full flex-col gap-4 md:w-1/2 lg:w-[calc(100%-480px)]">
                <div className="w-full md:h-[648px] rounded-xl border">
                  chart
                </div>
                <div className="w-full md:h-[320px] rounded-xl border">
                  tables
                </div>
              </div>
              <div className="flex w-full flex-col gap-4 md:w-[480px]">
                <div className="border w-full h-[210px] rounded-xl">
                  <span className="hidden md:block">search</span>
                  <span className="md:hidden block">fav/recent + search</span>
                </div>
                <TradeWidget />
                <div className="w-full h-[420px] rounded-xl border hidden md:block">
                  fav/recent
                </div>
              </div>
            </div>
          </Container>
        </main>
      )}
    </>
  )
}

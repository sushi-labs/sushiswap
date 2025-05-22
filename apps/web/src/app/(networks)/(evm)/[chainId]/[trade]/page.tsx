'use client'

import { Container, SkeletonBox } from '@sushiswap/ui'
import React from 'react'
import { useSkaleEuropaFaucet } from 'src/lib/hooks'
import { useDerivedStateTrade } from 'src/ui/swap/trade/derivedstate-trade-provider'
import { TradeViewSwitch } from 'src/ui/swap/trade/trade-view-switch'
import { TradeWidget } from 'src/ui/swap/trade/trade-widget'

export default function TradePage() {
  const {
    state: { tradeView },
  } = useDerivedStateTrade()
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
            <div className="flex w-full gap-4">
              <div className="flex flex-col gap-4 w-[calc(100%-480px)]">
                <SkeletonBox className="w-full h-[648px] rounded-xl" />
                <SkeletonBox className="w-full h-[320px] rounded-xl" />
              </div>
              <div className="flex flex-col gap-4 w-[480px]">
                <SkeletonBox className="w-full h-[210px] rounded-xl" />
                <TradeWidget />
                <SkeletonBox className="w-full h-[420px] rounded-xl" />
              </div>
            </div>
          </Container>
        </main>
      )}
    </>
  )
}

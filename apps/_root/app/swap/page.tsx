'use client'

import Container from '@sushiswap/ui/future/components/Container'
import React from 'react'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { TradeStats } from '../../ui/swap/trade/TradeStats'
import { Widget } from '../../ui/swap/widget/Widget'
import { Drawer } from '@sushiswap/ui/future/components/drawer'
import { TokenNotFoundDialog } from '../../ui/swap/TokenNotFoundDialog'
import { TradeReviewDialog } from '../../ui/swap/trade/TradeReviewDialog'

// export const dynamic = 'force-dynamic'

export default async function SwapPage() {
  // simulating to force loading segment...
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  // console.log('Swap page')
  return (
    <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
      <Drawer.Root>
        <Checker.Root>
          <Widget />
          <TradeStats />
          <TradeReviewDialog />
          <TokenNotFoundDialog />
        </Checker.Root>
      </Drawer.Root>
      {/*spacer for fixed positioned swap button */}
      <div className="h-[68px] w-full" />
    </Container>
  )
}

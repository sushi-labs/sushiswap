import Container from '@sushiswap/ui13/components/Container'
import React, { FC } from 'react'

import { SwapProvider } from '../ui/trade/TradeProvider'
import { TradeReviewDialog } from '../ui/trade/TradeReviewDialog'
import { TradeStats } from '../ui/trade/TradeStats'
import { SwapButton } from '../ui/widget/SwapButton'
import { Widget } from '../ui/widget/Widget'

const Page: FC = () => {
  return (
    <Container maxWidth={520} className="space-y-8 p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
      <SwapProvider>
        <Widget />
        <TradeStats />
        <TradeReviewDialog />
        <SwapButton />
      </SwapProvider>

      {/*spacer for fixed positioned swap button */}
      <div className="h-[68px] w-full" />
    </Container>
  )
}

export default Page

import Container from '@sushiswap/ui13/components/Container'
import React from 'react'

import { SwapProvider } from '../ui/TradeProvider'
import { TradeStats } from '../ui/TradeStats'
import { SwapButton } from '../ui/widget/SwapButton'
import { Widget } from '../ui/widget/Widget'

export default function Page() {
  return (
    <SwapProvider>
      <Container maxWidth={520} className="space-y-8 p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <Widget />
        <TradeStats />
        <SwapButton />
      </Container>
    </SwapProvider>
  )
}

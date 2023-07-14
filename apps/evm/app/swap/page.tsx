'use client'

import { Container } from '@sushiswap/ui/components/container'
import React from 'react'

import { TokenNotFoundDialog } from '../../ui/swap/TokenNotFoundDialog'
import { TradeStats } from '../../ui/swap/trade/TradeStats'
import { Widget } from '../../ui/swap/widget/Widget'

export default async function SwapPage() {
  return (
    <Container maxWidth="lg" className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
      <Widget />
      <TradeStats />
      <TokenNotFoundDialog />
    </Container>
  )
}

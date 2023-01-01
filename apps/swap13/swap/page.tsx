import Container from '@sushiswap/ui13/components/Container'
import React from 'react'

import { SwapProvider } from '../ui/TradeProvider'
import { TradeReviewDialog } from '../ui/TradeReviewDialog'
import { TradeStats } from '../ui/TradeStats'
import { TradeRoute } from '../ui/TradeRoute'
import { SwapButton } from '../ui/widget/SwapButton'
import { Widget } from '../ui/widget/Widget'

export default function Page({
  params,
  searchParams,
}: {
  params: { fromChainId: string; toChainId: string; fromCurrencyId: string; toCurrencyId: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { fromChainId, toChainId, fromCurrencyId, toCurrencyId } = params
  console.log({ fromChainId, toChainId, fromCurrencyId, toCurrencyId, searchParams })
  return (
    <SwapProvider params={params}>
      <Container maxWidth={520} className="space-y-8 p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <Widget />
        <TradeStats />
        <SwapButton />
        <TradeReviewDialog />
        <TradeRoute />
      </Container>
    </SwapProvider>
  )
}

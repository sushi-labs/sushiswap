'use client'

import type { ReactElement } from 'react'
import type { SupportedChainId } from 'src/config'
import type { EvmChainId } from 'sushi/evm'
import { DetailsInteractionTrackerProvider } from '../../_ui/details-interaction-tracker-provider'
import { DerivedstateSimpleSwapProvider } from './derivedstate-simple-swap-provider'
import { EvmSimpleSwapTradeQuoteProvider } from './evm-simple-swap-trade-quote-provider'
import { EvmSimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog/evm-simple-swap-trade-review-dialog'
import { SimpleSwapWidget } from './simple-swap-widget'

export function EvmSimpleSwapRuntime({
  chainId,
}: {
  chainId: EvmChainId & SupportedChainId
}): ReactElement {
  return (
    <DerivedstateSimpleSwapProvider chainId={chainId}>
      <EvmSimpleSwapTradeQuoteProvider>
        <DetailsInteractionTrackerProvider>
          <SimpleSwapWidget
            TradeReviewDialog={EvmSimpleSwapTradeReviewDialog}
          />
        </DetailsInteractionTrackerProvider>
      </EvmSimpleSwapTradeQuoteProvider>
    </DerivedstateSimpleSwapProvider>
  )
}

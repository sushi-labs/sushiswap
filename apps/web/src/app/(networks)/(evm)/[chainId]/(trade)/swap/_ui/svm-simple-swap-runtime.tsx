'use client'

import type { ReactElement } from 'react'
import type { SupportedChainId } from 'src/config'
import type { SvmChainId } from 'sushi/svm'
import { DetailsInteractionTrackerProvider } from '../../_ui/details-interaction-tracker-provider'
import { DerivedstateSimpleSwapProvider } from './derivedstate-simple-swap-provider'
import { SvmSimpleSwapTradeReviewDialog } from './simple-swap-trade-review-dialog/svm-simple-swap-trade-review-dialog'
import { SimpleSwapWidget } from './simple-swap-widget'
import { SvmSimpleSwapTradeQuoteProvider } from './svm-simple-swap-trade-quote-provider'

export function SvmSimpleSwapRuntime({
  chainId,
}: {
  chainId: SvmChainId & SupportedChainId
}): ReactElement {
  return (
    <DerivedstateSimpleSwapProvider chainId={chainId}>
      <SvmSimpleSwapTradeQuoteProvider>
        <DetailsInteractionTrackerProvider>
          <SimpleSwapWidget
            TradeReviewDialog={SvmSimpleSwapTradeReviewDialog}
          />
        </DetailsInteractionTrackerProvider>
      </SvmSimpleSwapTradeQuoteProvider>
    </DerivedstateSimpleSwapProvider>
  )
}

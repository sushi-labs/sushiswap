'use client'

import {
  DialogContent,
  DialogFooter,
  DialogProvider,
  DialogReview,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { ConfirmSwapButton } from './cross-chain-swap-trade-review-dialog/confirm-swap-button'
import { DialogBody } from './cross-chain-swap-trade-review-dialog/dialog-body'
import { RecipientSection } from './cross-chain-swap-trade-review-dialog/recipient-section'
import { ReviewIntro } from './cross-chain-swap-trade-review-dialog/review-intro'
import { TradeDetails } from './cross-chain-swap-trade-review-dialog/trade-details'
import { TradeHeader } from './cross-chain-swap-trade-review-dialog/trade-header'
import { TradeWarnings } from './cross-chain-swap-trade-review-dialog/trade-warnings'

interface CrossChainSwapTradeReviewDialogProps {
  children: ReactNode
}

export function CrossChainSwapTradeReviewDialog({
  children,
}: CrossChainSwapTradeReviewDialogProps) {
  return (
    <DialogProvider>
      <CrossChainSwapTradeReviewDialogContent>
        {children}
      </CrossChainSwapTradeReviewDialogContent>
    </DialogProvider>
  )
}

function CrossChainSwapTradeReviewDialogContent({
  children,
}: {
  children: ReactNode
}) {
  // Placeholder states - will be implemented with useCrossChainSwapTradeReview
  const isWritePending = false
  const isEstGasError = false
  const isStepQueryError = false
  const showPriceImpactWarning = false
  const showSlippageWarning = false
  const estGasError: Error | null = null

  const write = undefined

  return (
    <DialogReview>
      {({ confirm }) => (
        <>
          <ReviewIntro estGasError={estGasError}>{children}</ReviewIntro>
          <DialogContent className="max-h-[80vh]">
            <TradeHeader />
            <DialogBody>
              <TradeWarnings
                showSlippageWarning={showSlippageWarning}
                showPriceImpactWarning={showPriceImpactWarning}
              />
              <TradeDetails />
              <RecipientSection />
            </DialogBody>
            <DialogFooter>
              <ConfirmSwapButton
                confirm={confirm}
                write={write}
                isWritePending={isWritePending}
                isEstGasError={isEstGasError}
                isStepQueryError={isStepQueryError}
                showPriceImpactWarning={showPriceImpactWarning}
                showSlippageWarning={showSlippageWarning}
              />
            </DialogFooter>
          </DialogContent>
        </>
      )}
    </DialogReview>
  )
}

'use client'

import type { ReactElement } from 'react'
import { SimpleSwapTradeReviewDialogContent } from './simple-swap-trade-review-dialog-content'
import type { SimpleSwapTradeReviewDialogProps } from './types'
import { useEvmSimpleSwapTradeReview } from './use-evm-simple-swap-trade-review'
import { getSimpleSwapTradeReview } from './use-simple-swap-trade-review'

export function EvmSimpleSwapTradeReviewDialog({
  autoConfirm,
  children,
  variant,
}: SimpleSwapTradeReviewDialogProps): ReactElement {
  const baseTradeReview = useEvmSimpleSwapTradeReview({ variant })
  const tradeReview = getSimpleSwapTradeReview(baseTradeReview)

  return (
    <SimpleSwapTradeReviewDialogContent
      autoConfirm={autoConfirm}
      tradeReview={tradeReview}
      variant={variant}
    >
      {children}
    </SimpleSwapTradeReviewDialogContent>
  )
}

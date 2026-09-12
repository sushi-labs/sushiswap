'use client'

import type { ReactElement } from 'react'
import { SimpleSwapTradeReviewDialogContent } from './simple-swap-trade-review-dialog-content'
import type { SimpleSwapTradeReviewDialogProps } from './types'
import { getSimpleSwapTradeReview } from './use-simple-swap-trade-review'
import { useSvmSimpleSwapTradeReview } from './use-svm-simple-swap-trade-review'

export function SvmSimpleSwapTradeReviewDialog({
  autoConfirm,
  children,
  variant,
}: SimpleSwapTradeReviewDialogProps): ReactElement {
  const baseTradeReview = useSvmSimpleSwapTradeReview()
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

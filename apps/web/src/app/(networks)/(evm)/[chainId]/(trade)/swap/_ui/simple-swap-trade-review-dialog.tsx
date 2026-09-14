'use client'

import type { ReactElement } from 'react'
import { DialogProvider } from 'src/lib/transaction-dialog'
import type {
  SimpleSwapTradeReviewDialogComponent,
  SimpleSwapTradeReviewDialogProps,
} from './simple-swap-trade-review-dialog/types'

export type { SimpleSwapTradeReviewDialogVariant } from './simple-swap-trade-review-dialog/types'

export function SimpleSwapTradeReviewDialog({
  TradeReviewDialog,
  autoConfirm = false,
  children,
  variant = 'default',
}: SimpleSwapTradeReviewDialogProps & {
  TradeReviewDialog: SimpleSwapTradeReviewDialogComponent
}): ReactElement {
  return (
    <DialogProvider>
      <TradeReviewDialog autoConfirm={autoConfirm} variant={variant}>
        {children}
      </TradeReviewDialog>
    </DialogProvider>
  )
}

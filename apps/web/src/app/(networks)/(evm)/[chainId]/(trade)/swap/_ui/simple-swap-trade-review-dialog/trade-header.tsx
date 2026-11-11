'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  classNames,
} from '@sushiswap/ui'
import type { SimpleSwapTradeReviewDialogVariant } from '../simple-swap-trade-review-dialog'

export function TradeHeader({
  variant,
}: {
  variant: SimpleSwapTradeReviewDialogVariant
}) {
  return (
    <DialogHeader className="!text-left">
      <DialogTitle
        className={classNames(
          variant === 'perps' && '!text-perps-muted',
          '!text-2xl',
        )}
      >
        Review Swap
      </DialogTitle>
      <DialogDescription aria-describedby={'Review Swap'} />
    </DialogHeader>
  )
}

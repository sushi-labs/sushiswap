import type { ComponentType, ReactNode } from 'react'
import type { getSimpleSwapTradeReview } from './use-simple-swap-trade-review'

export type SimpleSwapTradeReviewDialogVariant = 'default' | 'perps'

export type SimpleSwapTradeReviewDialogProps = {
  children({
    error,
    isSuccess,
  }: { error: Error | null; isSuccess: boolean }): ReactNode
  autoConfirm?: boolean
  variant?: SimpleSwapTradeReviewDialogVariant
}
export type SimpleSwapTradeReviewDialogComponent =
  ComponentType<SimpleSwapTradeReviewDialogProps>

export type SimpleSwapTradeReview = ReturnType<typeof getSimpleSwapTradeReview>

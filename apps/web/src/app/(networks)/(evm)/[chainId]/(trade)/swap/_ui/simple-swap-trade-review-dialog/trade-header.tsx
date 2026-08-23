'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  classNames,
} from '@sushiswap/ui'
import React from 'react'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query/trade/types'
import { useDerivedStateSimpleSwap } from '../derivedstate-simple-swap-provider'
import type { SimpleSwapTradeReviewDialogVariant } from '../simple-swap-trade-review-dialog'

export function TradeHeader({
  trade,
  isWrap,
  isUnwrap,
  variant,
}: {
  trade: UseEvmTradeReturn | UseSvmTradeReturn | undefined
  isWrap: boolean
  isUnwrap: boolean
  variant: SimpleSwapTradeReviewDialogVariant
}) {
  const {
    state: { token0, token1, swapAmount },
  } = useDerivedStateSimpleSwap()

  return (
    <DialogHeader className="!text-left">
      <DialogTitle
        className={classNames(variant === 'perps' && '!text-perps-muted')}
      >
        Buy {trade?.amountOut?.toSignificant(6)} {token1?.symbol}
      </DialogTitle>
      <DialogDescription
        className={classNames(variant === 'perps' && '!text-perps-muted-50')}
      >
        {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'}{' '}
        {swapAmount?.toSignificant(6)} {token0?.symbol}
      </DialogDescription>
    </DialogHeader>
  )
}

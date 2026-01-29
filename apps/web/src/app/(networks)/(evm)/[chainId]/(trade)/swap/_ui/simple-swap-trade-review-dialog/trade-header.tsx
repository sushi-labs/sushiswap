'use client'

import { DialogDescription, DialogHeader, DialogTitle } from '@sushiswap/ui'
import React, { type FC } from 'react'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'
import { useDerivedStateSimpleSwap } from '../derivedstate-simple-swap-provider'

export function TradeHeader({
  trade,
  isWrap,
  isUnwrap,
}: {
  trade: UseEvmTradeReturn | UseSvmTradeReturn | undefined
  isWrap: boolean
  isUnwrap: boolean
}) {
  const {
    state: { token0, token1, swapAmount },
  } = useDerivedStateSimpleSwap()

  return (
    <DialogHeader className="!text-left">
      <DialogTitle>
        Buy {trade?.amountOut?.toSignificant(6)} {token1?.symbol}
      </DialogTitle>
      <DialogDescription>
        {isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Sell'}{' '}
        {swapAmount?.toSignificant(6)} {token0?.symbol}
      </DialogDescription>
    </DialogHeader>
  )
}

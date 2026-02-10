'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  SwapEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { NativeAddress } from 'src/lib/constants'
import type {
  UseEvmTradeReturn,
  UseSvmTradeReturn,
} from 'src/lib/hooks/react-query'
import { type Amount, ZERO } from 'sushi'

export const ConfirmSwapButton: FC<{
  confirm: () => void
  trade: UseEvmTradeReturn | UseSvmTradeReturn | undefined
  token0Symbol?: string
  token1Symbol?: string
  isWrap: boolean
  isUnwrap: boolean
  isSwapQueryError: boolean
  isWritePending: boolean
  swapAmount: Amount<any> | undefined
  showPriceImpactWarning: boolean
  showSlippageWarning: boolean
  write?: (confirm: () => void) => Promise<void>
  trace: object
}> = ({
  confirm,
  trade,
  token0Symbol,
  token1Symbol,
  isWrap,
  isUnwrap,
  isSwapQueryError,
  isWritePending,
  swapAmount,
  showPriceImpactWarning,
  showSlippageWarning,
  write,
  trace,
}) => {
  const disabled = Boolean(
    isWritePending ||
      Boolean(!write && swapAmount?.gt(ZERO)) ||
      isSwapQueryError,
  )

  return (
    <div className="flex flex-col gap-4 w-full">
      <TraceEvent
        events={[BrowserEvent.onClick]}
        element={InterfaceElementName.CONFIRM_SWAP_BUTTON}
        name={SwapEventName.SWAP_SUBMITTED_BUTTON_CLICKED}
        properties={{
          token_from:
            trade?.amountIn?.currency.type === 'token'
              ? trade?.amountIn?.currency.address
              : NativeAddress,
          token_to:
            trade?.amountOut?.currency.type === 'token'
              ? trade?.amountOut?.currency.address
              : NativeAddress,
          ...trace,
        }}
      >
        <Button
          fullWidth
          size="xl"
          loading={!write && !isSwapQueryError}
          onClick={() => write?.(confirm)}
          disabled={disabled}
          color={
            isSwapQueryError || showPriceImpactWarning || showSlippageWarning
              ? 'red'
              : 'blue'
          }
          testId="confirm-swap"
        >
          {isSwapQueryError
            ? 'Shoot! Something went wrong :('
            : isWrap
              ? 'Wrap'
              : isUnwrap
                ? 'Unwrap'
                : `Swap ${token0Symbol} for ${token1Symbol}`}
        </Button>
      </TraceEvent>
    </div>
  )
}

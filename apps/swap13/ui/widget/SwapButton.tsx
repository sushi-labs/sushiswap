'use client'

import { Button } from '@sushiswap/ui13/components/button'
import Container from '@sushiswap/ui13/components/Container'
import React, { FC, ReactNode, useCallback, useState } from 'react'

import { ConfirmationDialog } from '../ConfirmationDialog'
import { useSwapActions, useSwapState } from '../TradeProvider'
import { Loader } from '@sushiswap/ui13/components/Loader'
import { useTrade } from '../../lib/useTrade'

export const SwapButton: FC = () => {
  const [open, setOpen] = useState(false)
  const { value, token0, token1, review } = useSwapState()
  const { data: trade } = useTrade()
  const { setReview } = useSwapActions()

  const onClick = useCallback(() => {
    if (review) {
      setOpen(true)
    } else {
      setReview(true)
    }
  }, [review, setReview])

  let disabled = false
  let title: ReactNode = 'Review Swap'

  if (review) title = `Swap ${token0.symbol} for ${token1.symbol}`
  if (!review) title = 'Review Swap'
  if (!value) {
    title = 'Enter amount'
    disabled = true
  }
  if (value && !trade) {
    title = <Loader size={16} className="text-white" />
    disabled = true
  }

  return (
    <>
      <div className="fixed bottom-6 sm:p-4 !pb-0 left-4 right-4 w-[unset] sm:!mr-[var(--scroll-lock-safe-area)]">
        <Container maxWidth={520} className="mx-auto flex flex-col gap-2">
          <p className="text-center text-xs text-blue cursor-pointer">
            What is an approval? <span className="text-gray-600">(show button when user needs to do approval)</span>
          </p>
          <Button fullWidth size="xl" onClick={onClick} disabled={disabled} className="z-[1082]">
            {title}
          </Button>
        </Container>
      </div>
      <ConfirmationDialog open={open} setOpen={setOpen} />
    </>
  )
}

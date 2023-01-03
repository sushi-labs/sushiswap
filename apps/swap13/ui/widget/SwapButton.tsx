'use client'

import { Button } from '@sushiswap/ui13/components/button'
import Container from '@sushiswap/ui13/components/Container'
import React, { FC, useCallback, useState } from 'react'

import { ConfirmationDialog } from '../ConfirmationDialog'
import { useSwapActions, useSwapState } from '../TradeProvider'

export const SwapButton: FC = () => {
  const [open, setOpen] = useState(false)
  const { token0, token1, review } = useSwapState()
  const { setReview } = useSwapActions()

  const onClick = useCallback(() => {
    if (review) {
      setOpen(true)
    } else {
      setReview(true)
    }
  }, [review, setReview])

  return (
    <>
      <div className="fixed bottom-6 sm:p-4 !pb-0 left-4 right-4 w-[unset] sm:!mr-[var(--scroll-lock-safe-area)]">
        <Container maxWidth={520} className="mx-auto">
          <Button fullWidth size="xl" onClick={onClick} className="z-[1082]">
            {review ? (
              <>
                Swap {token0.symbol} for {token1.symbol}
              </>
            ) : (
              'Review Swap'
            )}
          </Button>
        </Container>
      </div>
      <ConfirmationDialog open={open} setOpen={setOpen} />
    </>
  )
}

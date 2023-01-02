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
      <Container maxWidth={520} className="fixed bottom-6 mx-auto sm:p-4 !pb-0 left-4 right-4 w-[unset]">
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
      <ConfirmationDialog open={open} setOpen={setOpen} />
    </>
  )
}

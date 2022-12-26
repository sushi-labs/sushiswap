'use client'

import { Button } from '@sushiswap/ui13/components/button'
import Container from '@sushiswap/ui13/components/Container'
import React, { FC, useState } from 'react'

import { ConfirmationDialog } from '../ConfirmationDialog'
import { useSwapState } from '../TradeProvider'

export const SwapButton: FC = () => {
  const [open, setOpen] = useState(false)
  const { token0, token1 } = useSwapState()

  return (
    <>
      <Container maxWidth={500} className="fixed bottom-6 mx-auto left-4 right-4 w-[unset]">
        <Button fullWidth size="xl" onClick={() => setOpen(true)}>
          Swap {token0.symbol} for {token1.symbol}
        </Button>
      </Container>
      <ConfirmationDialog open={open} setOpen={setOpen} />
    </>
  )
}

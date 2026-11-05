import { Message } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { Bound } from 'src/lib/constants'
import { TickMath } from 'sushi/evm'

// An arbitrary threshold for prices too close to the protocol's limits
const EXTREME_TICK_THRESHOLD = 1500

function getExtremeTickBound(tick: number | undefined): Bound | undefined {
  if (tick === undefined) return undefined
  if (tick <= TickMath.MIN_TICK + EXTREME_TICK_THRESHOLD) return Bound.LOWER
  if (tick >= TickMath.MAX_TICK - EXTREME_TICK_THRESHOLD) return Bound.UPPER
  return undefined
}

/** Warns when a pool's current price sits near the protocol's tick limits. */
export function ExtremeTickWarning({
  tickCurrent,
}: {
  tickCurrent: number | undefined
}): ReactNode {
  const bound = getExtremeTickBound(tickCurrent)
  if (!bound) return null

  return (
    <Message size="sm" variant="warning">
      The pool's current price is close to the{' '}
      {bound === Bound.LOWER ? 'minimum' : 'maximum'} allowed by the protocol.
      It might not reflect the true market price and could lead to a loss of
      funds if liquidity is provided. Please double-check if the price is
      accurate before proceeding.
    </Message>
  )
}

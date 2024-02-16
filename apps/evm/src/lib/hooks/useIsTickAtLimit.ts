'use client'

import {
  SushiSwapV3FeeAmount,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
} from 'sushi'
import { useMemo } from 'react'

import { Bound } from '../constants'

export default function useIsTickAtLimit(
  feeAmount: SushiSwapV3FeeAmount | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined,
) {
  return useMemo(
    () => ({
      [Bound.LOWER]:
        feeAmount && typeof tickLower === 'number'
          ? tickLower ===
            nearestUsableTick(
              TickMath.MIN_TICK,
              TICK_SPACINGS[feeAmount as SushiSwapV3FeeAmount],
            )
          : undefined,
      [Bound.UPPER]:
        feeAmount && typeof tickUpper === 'number'
          ? tickUpper ===
            nearestUsableTick(
              TickMath.MAX_TICK,
              TICK_SPACINGS[feeAmount as SushiSwapV3FeeAmount],
            )
          : undefined,
    }),
    [feeAmount, tickLower, tickUpper],
  )
}

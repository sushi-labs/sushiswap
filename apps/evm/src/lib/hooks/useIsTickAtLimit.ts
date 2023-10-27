'use client'

import {
  FeeAmount,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
} from '@sushiswap/v3-sdk'
import { useMemo } from 'react'

import { Bound } from '../constants'

export default function useIsTickAtLimit(
  feeAmount: FeeAmount | undefined,
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
              TICK_SPACINGS[feeAmount as FeeAmount],
            )
          : undefined,
      [Bound.UPPER]:
        feeAmount && typeof tickUpper === 'number'
          ? tickUpper ===
            nearestUsableTick(
              TickMath.MAX_TICK,
              TICK_SPACINGS[feeAmount as FeeAmount],
            )
          : undefined,
    }),
    [feeAmount, tickLower, tickUpper],
  )
}

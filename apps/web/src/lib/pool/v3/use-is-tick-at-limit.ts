'use client'

import { useMemo } from 'react'
import { type SushiSwapV3FeeAmount, TICK_SPACINGS } from 'sushi/evm'
import { Bound } from '../../constants'
import { getTickLimits } from '../cl'

export function useIsTickAtLimit(
  feeAmount: SushiSwapV3FeeAmount | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined,
) {
  return useMemo(() => {
    const limits = getTickLimits(
      feeAmount ? TICK_SPACINGS[feeAmount] : undefined,
    )
    return {
      [Bound.LOWER]:
        feeAmount && typeof tickLower === 'number'
          ? tickLower === limits[Bound.LOWER]
          : undefined,
      [Bound.UPPER]:
        feeAmount && typeof tickUpper === 'number'
          ? tickUpper === limits[Bound.UPPER]
          : undefined,
    }
  }, [feeAmount, tickLower, tickUpper])
}

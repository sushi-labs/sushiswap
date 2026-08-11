'use client'

import {
  SlippageToleranceStorageKey,
  getSlippageToleranceBasisPoints,
  useSlippageTolerance as useStoredSlippageTolerance,
} from '@sushiswap/hooks'
import { useMemo } from 'react'
import { Percent } from 'sushi'
import { DEFAULT_SLIPPAGE } from 'sushi/evm'

export const useSlippageTolerance = (
  key: SlippageToleranceStorageKey = SlippageToleranceStorageKey.Swap,
  defaultValue?: string,
) => {
  const [slippageTolerance, setSlippageTolerance] = useStoredSlippageTolerance(
    key,
    defaultValue,
  )
  const basisPoints =
    getSlippageToleranceBasisPoints(slippageTolerance) ??
    getSlippageToleranceBasisPoints(DEFAULT_SLIPPAGE)!

  return useMemo(
    () =>
      [
        new Percent({
          numerator: basisPoints,
          denominator: 10_000,
        }),
        {
          slippageTolerance,
          setSlippageTolerance,
        },
      ] as const,
    [basisPoints, slippageTolerance, setSlippageTolerance],
  )
}

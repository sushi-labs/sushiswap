'use client'

import { SlippageToleranceStorageKey, useLocalStorage } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { DEFAULT_SLIPPAGE } from 'sushi/config'
import { Percent } from 'sushi/math'

export const useSlippageTolerance = (
  key: SlippageToleranceStorageKey = SlippageToleranceStorageKey.Swap,
) => {
  const [slippageTolerance, setSlippageTolerance] = useLocalStorage<
    number | string
  >(key, DEFAULT_SLIPPAGE)

  return useMemo(
    () =>
      [
        new Percent(
          Math.floor(
            Number(
              slippageTolerance === 'AUTO'
                ? DEFAULT_SLIPPAGE
                : slippageTolerance,
            ) * 100,
          ),
          10_000,
        ),
        {
          slippageTolerance,
          setSlippageTolerance,
        },
      ] as const,
    [slippageTolerance, setSlippageTolerance],
  )
}

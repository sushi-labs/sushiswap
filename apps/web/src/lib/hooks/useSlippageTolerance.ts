'use client'

import { SlippageToleranceStorageKey, useLocalStorage } from '@sushiswap/hooks'
import { useMemo } from 'react'
import { Percent } from 'sushi'
import { DEFAULT_SLIPPAGE } from 'sushi/evm'

export const useSlippageTolerance = (
  key: SlippageToleranceStorageKey = SlippageToleranceStorageKey.Swap,
) => {
  const [slippageTolerance, setSlippageTolerance] = useLocalStorage<
    number | string
  >(key, DEFAULT_SLIPPAGE)

  return useMemo(
    () =>
      [
        new Percent({
          numerator: Math.floor(
            Number(
              slippageTolerance === 'AUTO'
                ? DEFAULT_SLIPPAGE
                : slippageTolerance,
            ) * 100,
          ),
          denominator: 10_000,
        }),
        {
          slippageTolerance,
          setSlippageTolerance,
        },
      ] as const,
    [slippageTolerance, setSlippageTolerance],
  )
}

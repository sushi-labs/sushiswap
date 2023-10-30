'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { Percent } from 'sushi/math'

export const useSlippageTolerance = (
  key: string | undefined = 'swapSlippage',
) => {
  const [slippageTolerance, setSlippageTolerance] = useLocalStorage<
    number | string
  >(key, 0.5)

  return [
    new Percent(
      Math.floor(
        Number(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100,
      ),
      10_000,
    ),
    setSlippageTolerance,
  ] as const
}

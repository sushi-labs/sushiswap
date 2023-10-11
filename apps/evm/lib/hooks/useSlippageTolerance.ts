'use client'

import { useLocalStorage } from '@sushiswap/hooks'

export const useSlippageTolerance = (
  key: string | undefined = 'swapSlippage',
) => {
  return useLocalStorage<number | string>(key, 0.5)
}

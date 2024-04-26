'use client'

import { useLocalStorage } from './useLocalStorage'

export const useSlippageTolerance = (key?: string, defaultValue?: string) =>
  useLocalStorage(
    key ? `${key}-slippage` : 'swapSlippage',
    defaultValue || '0.1',
  )

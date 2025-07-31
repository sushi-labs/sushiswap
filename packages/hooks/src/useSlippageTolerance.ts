'use client'

import { DEFAULT_SLIPPAGE } from 'sushi/evm'
import { useLocalStorage } from './useLocalStorage'

export enum SlippageToleranceStorageKey {
  Swap = 'slippage-swap',
  AddLiquidity = 'slippage-add-liquidity',
  RemoveLiquidity = 'slippage-remove-liquidity',
}

export const useSlippageTolerance = (
  key: SlippageToleranceStorageKey = SlippageToleranceStorageKey.Swap,
  defaultValue?: string,
) => useLocalStorage(key, defaultValue || DEFAULT_SLIPPAGE)

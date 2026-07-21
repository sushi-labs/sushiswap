'use client'

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { DEFAULT_SLIPPAGE } from 'sushi/evm'
import { normalizeSlippageTolerance } from './slippage-tolerance'
import { useLocalStorage } from './useLocalStorage'

export enum SlippageToleranceStorageKey {
  Swap = 'slippage-swap',
  AddLiquidity = 'slippage-add-liquidity',
  RemoveLiquidity = 'slippage-remove-liquidity',
}

export function useSlippageTolerance(
  key: SlippageToleranceStorageKey = SlippageToleranceStorageKey.Swap,
  defaultValue?: string,
) {
  const safeDefault = useMemo(
    () =>
      normalizeSlippageTolerance(defaultValue) ??
      normalizeSlippageTolerance(DEFAULT_SLIPPAGE)!,
    [defaultValue],
  )
  const [storedValue, setStoredValue] = useLocalStorage<unknown>(
    key,
    safeDefault,
  )
  const slippageTolerance =
    normalizeSlippageTolerance(storedValue) ?? safeDefault

  useEffect(() => {
    if (storedValue !== slippageTolerance) {
      setStoredValue(slippageTolerance)
    }
  }, [setStoredValue, slippageTolerance, storedValue])

  const setSlippageTolerance: Dispatch<SetStateAction<string>> = useCallback(
    (value) => {
      setStoredValue((previousValue: unknown) => {
        const previousSlippage =
          normalizeSlippageTolerance(previousValue) ?? safeDefault
        const nextValue =
          value instanceof Function ? value(previousSlippage) : value

        return normalizeSlippageTolerance(nextValue) ?? previousSlippage
      })
    },
    [safeDefault, setStoredValue],
  )

  return useMemo(
    () => [slippageTolerance, setSlippageTolerance] as const,
    [setSlippageTolerance, slippageTolerance],
  )
}

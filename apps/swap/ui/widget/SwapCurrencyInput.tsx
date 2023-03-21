'use client'

import React, { FC, useEffect, useState } from 'react'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { useDebounce } from '@sushiswap/hooks'

export const SwapCurrencyInput: FC = () => {
  const { token0, value, network0, tokensLoading } = useSwapState()
  const [localValue, setLocalValue] = useState(value)
  const { setToken0, setValue } = useSwapActions()
  const debouncedValue = useDebounce(localValue, 250)

  // To avoid slow input
  useEffect(() => {
    setValue(debouncedValue)
  }, [setValue, debouncedValue])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className="p-3 bg-white dark:bg-slate-800 rounded-xl"
      chainId={network0}
      onSelect={setToken0}
      value={localValue}
      onChange={setLocalValue}
      currency={token0}
      currencyLoading={tokensLoading}
    />
  )
}

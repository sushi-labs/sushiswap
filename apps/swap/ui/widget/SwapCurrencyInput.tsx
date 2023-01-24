'use client'

import React, { FC, useEffect, useState } from 'react'
import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { useDebounce } from '@sushiswap/hooks'
import { AppType } from '@sushiswap/ui13/types'
import { Token } from '@sushiswap/currency'

const STG_CURRENCIES_INPUT: Record<string, Token> = {}

export const SwapCurrencyInput: FC = () => {
  const { token0, value, network0, appType, tokensLoading } = useSwapState()
  const [localValue, setLocalValue] = useState(value)
  const { setToken0, setValue } = useSwapActions()
  const debouncedValue = useDebounce(localValue, 250)

  // To avoid slow input
  useEffect(() => {
    setValue(debouncedValue)
  }, [setValue, debouncedValue])

  return (
    <Web3Input.Currency
      {...(appType === AppType.xSwap && { currencies: STG_CURRENCIES_INPUT })}
      type="INPUT"
      className="p-3 dark:bg-slate-800 bg-white rounded-xl"
      chainId={network0}
      onSelect={setToken0}
      value={localValue}
      onChange={setLocalValue}
      currency={token0}
      currencyLoading={tokensLoading}
    />
  )
}

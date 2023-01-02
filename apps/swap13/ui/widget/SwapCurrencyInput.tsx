import React, { FC, useEffect, useState } from 'react'
import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import { useSwapActions, useSwapState } from '../TradeProvider'

export const SwapCurrencyInput: FC = () => {
  const { token0, value, network0 } = useSwapState()
  const [localValue, setLocalValue] = useState(value)
  const { setToken0, setValue } = useSwapActions()

  // To avoid slow input
  useEffect(() => {
    setValue(value)
  }, [setValue, value])

  return (
    <Web3Input.Currency
      type="INPUT"
      className="p-3 dark:bg-slate-800 bg-white rounded-xl"
      chainId={network0}
      onSelect={setToken0}
      value={localValue}
      onChange={setLocalValue}
      currency={token0}
    />
  )
}

'use client'

import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { useState, useTransition } from 'react'

import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapToken0Input = () => {
  const [value, setValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const {
    state: { swapAmountString, chainId, token0 },
    mutate: { setSwapAmount, setToken0 },
    isLoading,
  } = useDerivedStateSimpleSwap()

  const handleChange = (val: string) => {
    setValue(val)
    startTransition(() => {
      setSwapAmount(val)
    })
  }

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      chainId={chainId}
      onSelect={setToken0}
      value={isPending ? value : swapAmountString}
      onChange={handleChange}
      currency={token0}
      loading={isLoading}
      currencyLoading={isLoading}
    />
  )
}

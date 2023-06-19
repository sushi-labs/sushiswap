'use client'

import React, { FC } from 'react'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { useTokenState } from '../token/TokenProvider'

export const SwapCurrencyInput: FC = () => {
  const { tokensLoading } = useTokenState()
  const { token0, value, network0 } = useSwapState()
  const { setToken0, setValue } = useSwapActions()

  return (
    <Web3Input.Currency
      id="swap-from"
      type="INPUT"
      className="p-3 bg-white dark:bg-slate-800 rounded-xl"
      chainId={network0}
      onSelect={setToken0}
      value={value}
      onChange={setValue}
      currency={token0}
      loading={tokensLoading}
      currencyLoading={tokensLoading}
    />
  )
}

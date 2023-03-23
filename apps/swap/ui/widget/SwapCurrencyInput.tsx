'use client'

import React, { FC, useEffect, useState } from 'react'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { useDebounce } from '@sushiswap/hooks'
import { useTokenState } from '../TokenProvider'

export const SwapCurrencyInput: FC = () => {
  const { tokensLoading } = useTokenState()
  const { token0, value, network0 } = useSwapState()
  const { setToken0, setValue } = useSwapActions()

  return (
    <Web3Input.Currency
      type="INPUT"
      className="p-3 dark:bg-slate-800 bg-white rounded-xl"
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

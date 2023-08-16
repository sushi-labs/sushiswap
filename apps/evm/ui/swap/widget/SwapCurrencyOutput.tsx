'use client'

import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import React, { FC } from 'react'

import { useTrade } from '../../../lib/swap/useTrade'
import { useTokenState } from '../token/TokenProvider'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'

export const SwapCurrencyOutput: FC = () => {
  const { tokensLoading } = useTokenState()
  const { network0, token1, network1 } = useSwapState()
  const { setToken1 } = useSwapActions()
  const { isInitialLoading: isLoading, isFetching, data: trade } = useTrade({ crossChain: network0 !== network1 })

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      className="p-3 bg-white dark:bg-slate-800 rounded-xl"
      disabled
      chainId={network1}
      onSelect={setToken1}
      value={trade?.amountOut?.toSignificant() ?? ''}
      currency={token1}
      usdPctChange={undefined}
      loading={isLoading}
      disableMaxButton
      currencyLoading={tokensLoading}
      fetching={isFetching}
    />
  )
}

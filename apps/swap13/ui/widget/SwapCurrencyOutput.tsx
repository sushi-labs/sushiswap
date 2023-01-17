'use client'

import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { usePctChange } from '../../lib/usePctChange'
import { useTrade } from '../../lib/useTrade'
import { usePrevious } from '@sushiswap/hooks'

export const SwapCurrencyOutput: FC = () => {
  const { token1, value, network1 } = useSwapState()

  const prevValue = usePrevious(value)
  const prevToken = usePrevious(token1)

  const { setToken1 } = useSwapActions()
  const usdPctChange = usePctChange()
  const { isLoading, isFetching, data: trade } = useTrade()

  const changed = value !== prevValue || token1 !== prevToken

  return (
    <Web3Input.Currency
      type="OUTPUT"
      className="p-3 dark:bg-slate-800 bg-white rounded-xl"
      disabled
      chainId={network1}
      onSelect={setToken1}
      value={trade?.amountOut?.toExact() ?? ''}
      currency={token1}
      usdPctChange={changed && isFetching ? undefined : usdPctChange}
      loading={Boolean(value && !trade && isLoading)}
      fetching={changed && isFetching}
      disableMaxButton
    />
  )
}

'use client'

import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC, useEffect, useRef } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { usePctChange } from '../../lib/usePctChange'
import { useTrade } from '../../lib/useTrade'
import { usePrevious } from '@sushiswap/hooks'

export const SwapCurrencyOutput: FC = () => {
  const { token1, network1, value } = useSwapState()
  const { setToken1 } = useSwapActions()
  const usdPctChange = usePctChange()
  const { isLoading, isFetching, data: trade, isPreviousData } = useTrade()

  return (
    <Web3Input.Currency
      type="OUTPUT"
      className="p-3 dark:bg-slate-800 bg-white rounded-xl"
      disabled
      chainId={network1}
      onSelect={setToken1}
      value={trade?.amountOut?.toExact() ?? ''}
      currency={token1}
      usdPctChange={isPreviousData && isFetching ? undefined : usdPctChange}
      loading={Boolean(value && !trade && isLoading)}
      fetching={isPreviousData && isFetching}
      disableMaxButton
    />
  )
}

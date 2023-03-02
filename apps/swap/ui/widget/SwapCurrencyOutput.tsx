'use client'

import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import React, { FC } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { usePctChange } from '../../lib/usePctChange'
import { useTrade } from '../../lib/useTrade'

export const SwapCurrencyOutput: FC = () => {
  const { network0, token1, network1, value, tokensLoading } = useSwapState()
  const { setToken1 } = useSwapActions()
  const usdPctChange = usePctChange()
  const { isLoading, isFetching, data: trade } = useTrade({ crossChain: network0 !== network1 })

  return (
    <Web3Input.Currency
      type="OUTPUT"
      className="p-3 dark:bg-slate-800 bg-white rounded-xl"
      disabled
      chainId={network1}
      onSelect={setToken1}
      value={trade?.amountOut?.toSignificant() ?? ''}
      currency={token1}
      usdPctChange={usdPctChange}
      loading={Boolean(isLoading && +value > 0) || isFetching}
      disableMaxButton
      currencyLoading={tokensLoading}
    />
  )
}

import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC } from 'react'
import { useSwapActions, useSwapState } from '../TradeProvider'
import { usePctChange } from '../../lib/usePctChange'
import { useTrade } from '../../lib/useTrade'

export const SwapCurrencyOutput: FC = () => {
  const { token1, value, network1 } = useSwapState()
  const { setToken1 } = useSwapActions()
  const usdPctChange = usePctChange()
  const { isLoading, isFetching, data: trade } = useTrade()

  return (
    <Web3Input.Currency
      type="OUTPUT"
      className="p-3 dark:bg-slate-800 bg-white rounded-xl"
      disabled
      chainId={network1}
      onSelect={setToken1}
      value={trade?.amountOut?.toExact() ?? ''}
      currency={token1}
      usdPctChange={usdPctChange}
      loading={Boolean(value && !trade && isLoading)}
      fetching={isFetching}
      disableMaxButton
    />
  )
}

'use client'

import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { usePctChange } from '../../lib/usePctChange'
import { useTrade } from '../../lib/useTrade'
import { AppType } from '@sushiswap/ui13/types'
import { Token } from '@sushiswap/currency'

const STG_CURRENCIES_OUTPUT: Record<string, Token> = {}

export const SwapCurrencyOutput: FC = () => {
  const { token1, appType, network1, value, tokensLoading } = useSwapState()
  const { setToken1 } = useSwapActions()
  const usdPctChange = usePctChange()
  const { isLoading, isFetching, data: trade } = useTrade()

  return (
    <Web3Input.Currency
      {...(appType === AppType.xSwap && { currencies: STG_CURRENCIES_OUTPUT })}
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

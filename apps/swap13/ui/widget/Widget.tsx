'use client'

import { Widget as UIWidget } from '@sushiswap/ui13/components/widget'
import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC } from 'react'
import { SettingsModule, SettingsOverlay2 } from 'ui/SettingsOverlay2'

import { useSwapActions, useSwapState } from '../TradeProvider'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { WidgetTitle } from './WidgetTitle'
import { useTrade } from '../../lib/useTrade'
import { CurrencyInput } from '@sushiswap/wagmi13/components/Web3Input/Currency'

export const Widget: FC = () => {
  const { token0, token1, value, network0, network1 } = useSwapState()
  const { setToken0, setToken1, setValue } = useSwapActions()
  const {
    isFetching,
    data: { amountOut },
  } = useTrade()

  return (
    <div className="flex flex-col gap-4">
      <WidgetTitle />
      <div className="flex justify-between items-center">
        <SwitchAppType />
        <SettingsOverlay2
          modules={[SettingsModule.SlippageTolerance, SettingsModule.ExpertMode, SettingsModule.CarbonOffset]}
        />
      </div>
      <UIWidget.Content>
        <Web3Input.Currency
          type="INPUT"
          className="p-3 dark:bg-slate-800 bg-white rounded-xl"
          chainId={network0}
          onSelect={setToken0}
          value={value}
          onChange={setValue}
          currency={token0}
        />
        <SwitchTokensButton />
        <Web3Input.Currency
          type="OUTPUT"
          className="p-3 dark:bg-slate-800 bg-white rounded-xl"
          disabled
          chainId={network1}
          onSelect={setToken1}
          value={amountOut?.toExact() ?? ''}
          currency={token1}
          usdPctChange={1.12}
          loading={isFetching}
          disableMaxButton
        />
      </UIWidget.Content>
    </div>
  )
}

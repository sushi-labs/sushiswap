'use client'

import Container from '@sushiswap/ui13/components/Container'
import { Widget as UIWidget } from '@sushiswap/ui13/components/widget'
import { Web3Input } from '@sushiswap/wagmi13/components/Web3Input'
import React, { FC } from 'react'

import { useSwapActions, useSwapState } from '../TradeProvider'
import { SwapButton } from './SwapButton'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { WidgetTitle } from './WidgetTitle'

export const Widget: FC = () => {
  const { token0, token1, value, otherValue, network0, network1 } = useSwapState()
  const { setToken0, setToken1, setValue } = useSwapActions()

  return (
    <>
      <Container maxWidth={520} className="mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <WidgetTitle />
        <SwitchAppType />
        <UIWidget.Content>
          <Web3Input.Currency
            className="p-3 pb-6 dark:bg-slate-800 bg-white rounded-xl"
            chainId={network0}
            onSelect={setToken0}
            value={value}
            onChange={setValue}
            currency={token0}
          />
          <SwitchTokensButton />
          <Web3Input.Currency
            className="p-3 pb-6 dark:bg-slate-800 bg-white rounded-xl"
            disabled
            chainId={network1}
            onSelect={setToken1}
            value={otherValue}
            currency={token1}
            usdPctChange={1.12}
          />
        </UIWidget.Content>
      </Container>
      <SwapButton />
    </>
  )
}

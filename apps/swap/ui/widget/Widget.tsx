'use client'

import { Widget as UIWidget } from '@sushiswap/ui/future/components/widget'
import React, { FC } from 'react'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { SwapCurrencyInput } from './SwapCurrencyInput'
import { SwapCurrencyOutput } from './SwapCurrencyOutput'
import { WidgetTitleV2 } from './WidgetTitleV2'
import { CrossChainBanner } from './CrossChainBanner'
import { SwapButton } from './SwapButton'
import { useSwapState } from '../trade/TradeProvider'
import { AppType } from '@sushiswap/ui'
import { SwapButtonCrossChain } from './SwapButtonCrossChain'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'

export const Widget: FC = () => {
  const { appType } = useSwapState()

  return (
    <div className="flex flex-col gap-4">
      <WidgetTitleV2 />
      <div className="flex justify-between items-center">
        <SwitchAppType />
        <SettingsOverlay
          modules={[
            SettingsModule.SlippageTolerance,
            SettingsModule.CarbonOffset,
            // SettingsModule.RoutingApi
          ]}
        />
      </div>
      <UIWidget.Content>
        <CrossChainBanner />
        <SwapCurrencyInput />
        <SwitchTokensButton />
        <SwapCurrencyOutput />
        {appType === AppType.Swap ? <SwapButton /> : <SwapButtonCrossChain />}
      </UIWidget.Content>
    </div>
  )
}

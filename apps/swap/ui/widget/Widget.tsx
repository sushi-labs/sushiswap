'use client'

import { Widget as UIWidget } from '@sushiswap/ui13/components/widget'
import React, { FC } from 'react'
import { SettingsModule, SettingsOverlay } from 'ui/settings'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { SwapCurrencyInput } from './SwapCurrencyInput'
import { SwapCurrencyOutput } from './SwapCurrencyOutput'
import { WidgetTitleV2 } from './WidgetTitleV2'
import { CrossChainBanner } from './CrossChainBanner'
import { ChainSelectors } from './ChainSelectors'

export const Widget: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <CrossChainBanner />
      <WidgetTitleV2 />
      <div className="flex justify-between items-center">
        <SwitchAppType />
        <SettingsOverlay modules={[SettingsModule.SlippageTolerance, SettingsModule.ExpertMode]} />
      </div>
      <UIWidget.Content>
        <ChainSelectors />
        <SwapCurrencyInput />
        <SwitchTokensButton />
        <SwapCurrencyOutput />
      </UIWidget.Content>
    </div>
  )
}

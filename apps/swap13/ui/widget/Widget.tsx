'use client'

import { Widget as UIWidget } from '@sushiswap/ui13/components/widget'
import React, { FC } from 'react'
import { SettingsModule, SettingsOverlay } from 'ui/settings'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { WidgetTitle } from './WidgetTitle'
import { SwapCurrencyInput } from './SwapCurrencyInput'
import { SwapCurrencyOutput } from './SwapCurrencyOutput'

export const Widget: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <WidgetTitle />
      <div className="flex justify-between items-center">
        <SwitchAppType />
        <SettingsOverlay
          modules={[SettingsModule.SlippageTolerance, SettingsModule.ExpertMode, SettingsModule.CarbonOffset]}
        />
      </div>
      <UIWidget.Content>
        <SwapCurrencyInput />
        <SwitchTokensButton />
        <SwapCurrencyOutput />
      </UIWidget.Content>
    </div>
  )
}

import { AppType } from '@sushiswap/ui'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { WidgetContent } from '@sushiswap/ui/components/widget'
import React, { FC } from 'react'

import { useSwapState } from '../trade/TradeProvider'
import { CrossChainBanner } from './CrossChainBanner'
import { SwapButton } from './SwapButton'
import { SwapButtonCrossChain } from './SwapButtonCrossChain'
import { SwapCurrencyInput } from './SwapCurrencyInput'
import { SwapCurrencyOutput } from './SwapCurrencyOutput'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { WidgetTitle } from './WidgetTitle'

export const Widget: FC = () => {
  const { appType } = useSwapState()
  return (
    <div className="flex flex-col gap-4">
      <WidgetTitle />
      <div className="flex items-center justify-between">
        <SwitchAppType />
        <SettingsOverlay
          modules={[SettingsModule.SlippageTolerance, SettingsModule.CarbonOffset, SettingsModule.RoutingApi]}
        />
      </div>
      <WidgetContent>
        <CrossChainBanner />
        <SwapCurrencyInput />
        <SwitchTokensButton />
        <SwapCurrencyOutput />
        {appType === AppType.Swap ? <SwapButton /> : <SwapButtonCrossChain />}
      </WidgetContent>
    </div>
  )
}

import { AppType } from '@sushiswap/ui'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import React, { FC } from 'react'

import { useSwapState } from '../trade/TradeProvider'
import { CrossChainBanner } from './CrossChainBanner'
import { SwapButton } from './SwapButton'
import { SwapButtonCrossChain } from './SwapButtonCrossChain'
import { SwapCurrencyInput } from './SwapCurrencyInput'
import { SwapCurrencyOutput } from './SwapCurrencyOutput'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { WidgetTitleV2 } from './WidgetTitleV2'

export const Widget: FC = () => {
  const { appType } = useSwapState()
  return (
    <div className="flex flex-col gap-4">
      <WidgetTitleV2 />
      <div className="flex items-center justify-between">
        <SwitchAppType />
        <SettingsOverlay modules={[SettingsModule.SlippageTolerance, SettingsModule.CarbonOffset]} />
      </div>
      <div>
        <CrossChainBanner />
        <SwapCurrencyInput />
        <SwitchTokensButton />
        <SwapCurrencyOutput />
        {appType === AppType.Swap ? <SwapButton /> : <SwapButtonCrossChain />}
      </div>
    </div>
  )
}

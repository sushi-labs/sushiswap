import { WidgetContent } from '@sushiswap/ui/components/widget'
import React, { FC } from 'react'
import { SwitchAppType } from './SwitchAppType'
import { SwitchTokensButton } from './SwitchTokensButton'
import { SwapCurrencyInput } from './SwapCurrencyInput'
import { SwapCurrencyOutput } from './SwapCurrencyOutput'
import { WidgetTitleV2 } from './WidgetTitleV2'
import { SwapButton } from './SwapButton'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/components/settings'
import { CrossChainBanner } from './CrossChainBanner'
import { SwapButtonCrossChain } from './SwapButtonCrossChain'
import { AppType } from '@sushiswap/ui'
import { useSwapState } from '../trade/TradeProvider'

export const Widget: FC = () => {
  const { appType } = useSwapState()
  return (
    <div className="flex flex-col gap-4">
      <WidgetTitleV2 />
      <div className="flex items-center justify-between">
        <SwitchAppType />
        <SettingsOverlay modules={[SettingsModule.SlippageTolerance, SettingsModule.CarbonOffset]} />
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

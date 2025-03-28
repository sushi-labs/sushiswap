import type { FC } from 'react'
import type { Token } from 'sushi/currency'
import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay'
import { SwapMaintenanceMessage } from '../simple/swap-maintenance-message'
import { DerivedstateSwapWidgetProvider } from './derivedstate-swap-widget-provider'
import { SwapModeButtons } from './swap-mode-buttons'
import { SwapWidgetSwitchTokensButton } from './swap-widget-switch-tokens-button'
import { SwapWidgetToken0Input } from './swap-widget-token0-input'
import { SwapWidgetToken1Input } from './swap-widget-token1-input'
import { SwapWidgetTradeButton } from './swap-widget-trade-button'

interface SwapWidgetProps {
  token: Token
}

export const SwapWidget: FC<SwapWidgetProps> = ({ token }) => {
  return (
    <DerivedstateSwapWidgetProvider chainId={token.chainId} token1={token}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SwapModeButtons token={token} />
          <SimpleSwapSettingsOverlay />
        </div>
        <SwapMaintenanceMessage />
        <SwapWidgetToken0Input />
        <SwapWidgetSwitchTokensButton />
        <SwapWidgetToken1Input />
        <SwapWidgetTradeButton />
      </div>
    </DerivedstateSwapWidgetProvider>
  )
}

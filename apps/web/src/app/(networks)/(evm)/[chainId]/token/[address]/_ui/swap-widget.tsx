import type { FC } from 'react'
import type { EvmToken } from 'sushi/evm'
import { SimpleSwapSettingsOverlay } from '~evm/[chainId]/[trade]/_ui/swap/simple-swap-settings-overlay'
import { SwapMaintenanceMessage } from '~evm/[chainId]/[trade]/_ui/swap/swap-maintenance-message'
import { DerivedstateSwapWidgetProvider } from './derivedstate-swap-widget-provider'
import { SwapModeButtons } from './swap-mode-buttons'
import { SwapWidgetSwitchTokensButton } from './swap-widget-switch-tokens-button'
import { SwapWidgetToken0Input } from './swap-widget-token0-input'
import { SwapWidgetToken1Input } from './swap-widget-token1-input'
import { SwapWidgetTradeButton } from './swap-widget-trade-button'

interface SwapWidgetProps {
  token1: EvmToken
}

export const SwapWidget: FC<SwapWidgetProps> = ({ token1 }) => {
  return (
    <DerivedstateSwapWidgetProvider chainId={token1.chainId} token1={token1}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SwapModeButtons token={token1} />
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

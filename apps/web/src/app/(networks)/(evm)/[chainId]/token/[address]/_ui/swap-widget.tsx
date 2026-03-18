import type { FC } from 'react'
import type { SupportedChainId } from 'src/config'
import type { EvmToken } from 'sushi/evm'
import { SwapMaintenanceMessage } from '~evm/[chainId]/(trade)/swap/_ui/swap-maintenance-message'
import { DerivedStateSwapWidgetProvider } from './derivedstate-swap-widget-provider'
import { SwapModeButtons } from './swap-mode-buttons'
import { SwapWidgetSettingsOverlay } from './swap-widget-settings-overlay'
import { SwapWidgetSwitchTokensButton } from './swap-widget-switch-tokens-button'
import { SwapWidgetToken0Input } from './swap-widget-token0-input'
import { SwapWidgetToken1Input } from './swap-widget-token1-input'
import { SwapWidgetTradeButton } from './swap-widget-trade-button'

interface SwapWidgetProps {
  token1: EvmToken
}

export const SwapWidget: FC<SwapWidgetProps> = ({ token1 }) => {
  return (
    <DerivedStateSwapWidgetProvider
      chainId={token1.chainId as SupportedChainId}
      token1={token1}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SwapModeButtons token={token1} />
          <SwapWidgetSettingsOverlay />
        </div>
        <SwapMaintenanceMessage />
        <SwapWidgetToken0Input />
        <SwapWidgetSwitchTokensButton />
        <SwapWidgetToken1Input />
        <SwapWidgetTradeButton />
      </div>
    </DerivedStateSwapWidgetProvider>
  )
}

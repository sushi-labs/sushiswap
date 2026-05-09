import { DetailsInteractionTrackerProvider } from '../../_ui/details-interaction-tracker-provider'
import { SwapModeButtons } from '../../_ui/swap-mode-buttons'
import { CrossChainSwapMaintenanceMessage } from './lifi/maintenance-message'
import { CrossChainSwapSettingsOverlay } from './cross-chain-swap-settings-overlay'
import { CrossChainSwapSwitchTokensButton } from './lifi/switch-tokens-button'
import { CrossChainSwapTokenNotFoundDialog } from './lifi/token-not-found-dialog'
import { CrossChainSwapToken0Input } from './lifi/token0-input'
import { CrossChainSwapToken1Input } from './lifi/token1-input'
import { CrossChainSwapTradeButton } from './lifi/trade-button'
import { CrossChainSwapTradeStats } from './lifi/trade-stats'

export function CrossChainSwapWidget() {
  return (
    <DetailsInteractionTrackerProvider>
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <SwapModeButtons />
          <CrossChainSwapSettingsOverlay />
        </div>
        <CrossChainSwapMaintenanceMessage />
        <CrossChainSwapToken0Input />
        <CrossChainSwapSwitchTokensButton />
        <div className="flex flex-col">
          <CrossChainSwapToken1Input />
          <CrossChainSwapTradeButton />
          <div className="mt-2">
            <CrossChainSwapTradeStats />
          </div>
        </div>
        <CrossChainSwapTokenNotFoundDialog />
      </div>
    </DetailsInteractionTrackerProvider>
  )
}

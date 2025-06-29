import { SwapModeButtons } from '../swap-mode-buttons'
import { CrossChainSwapHeader } from './cross-chain-swap-header'
import { CrossChainSwapMaintenanceMessage } from './cross-chain-swap-maintenance-message'
import { CrossChainSwapSettingsOverlay } from './cross-chain-swap-settings-overlay'
import { CrossChainSwapSwitchTokensButton } from './cross-chain-swap-switch-tokens-button'
import { CrossChainSwapTokenNotFoundDialog } from './cross-chain-swap-token-not-found-dialog'
import { CrossChainSwapToken0Input } from './cross-chain-swap-token0-input'
import { CrossChainSwapToken1Input } from './cross-chain-swap-token1-input'
import { CrossChainSwapTradeButton } from './cross-chain-swap-trade-button'
import { CrossChainSwapTradeStats } from './cross-chain-swap-trade-stats'

export const CrossChainSwapWidget = () => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(8,12,21,0.8)] rounded-3xl backdrop-blur-2xl">
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
        <CrossChainSwapTradeStats />
      </div>
      <CrossChainSwapTokenNotFoundDialog />
    </div>
  )
}

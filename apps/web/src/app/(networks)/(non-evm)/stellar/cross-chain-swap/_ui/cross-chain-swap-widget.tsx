'use client'

import { SimpleSwapSwitchTokensButton } from '~stellar/_common/ui/Swap/simple/simple-swap-switch-tokens-button'
import { SwapModeButtons } from '~stellar/_common/ui/Swap/swap-mode-buttons'
import { CrossChainSwapSettingsOverlay } from './cross-chain-swap-settings-overlay'
import { CrossChainSwapToken0Input } from './cross-chain-swap-token0-input'
import { CrossChainSwapToken1Input } from './cross-chain-swap-token1-input'
import { CrossChainSwapTradeButton } from './cross-chain-swap-trade-button'
import { CrossChainSwapTradeStats } from './cross-chain-swap-trade-stats'

export function CrossChainSwapWidget() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <SwapModeButtons />
          <CrossChainSwapSettingsOverlay />
        </div>
        <CrossChainSwapToken0Input />
        <SimpleSwapSwitchTokensButton />
        <div className="flex flex-col">
          <CrossChainSwapToken1Input />
          <CrossChainSwapTradeButton />
          <CrossChainSwapTradeStats />
        </div>
      </div>
    </div>
  )
}

import { SwapModeButtons } from '../swap-mode-buttons'
import { SimpleSwapExecuteButton } from './simple-swap-execute-button'
import { SimpleSwapSettingsOverlay } from './simple-swap-settings-overlay'
import { SimpleSwapSwitchTokensButton } from './simple-swap-switch-tokens-button'
import { SimpleSwapToken0Input } from './simple-swap-token0-input'
import { SimpleSwapToken1Input } from './simple-swap-token1-input'
import { SimpleSwapTradeStats } from './simple-swap-trade-stats'

export const SimpleSwapWidget = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <SwapModeButtons />
          <SimpleSwapSettingsOverlay />
        </div>
        <SimpleSwapToken0Input />
        <SimpleSwapSwitchTokensButton />
        <div className="flex flex-col">
          <SimpleSwapToken1Input />
          <SimpleSwapTradeStats />
          <SimpleSwapExecuteButton />
        </div>
      </div>
    </div>
  )
}

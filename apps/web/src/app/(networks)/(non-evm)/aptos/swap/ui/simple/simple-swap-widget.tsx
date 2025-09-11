import { SwapModeButtons } from '../swap-mode-buttons'
import { SimpleSwapHeader } from './simple-swap-header'
import { SimpleSwapSettingsOverlay } from './simple-swap-settings-overlay'
import { SimpleSwapSwitchTokensButton } from './simple-swap-switch-tokens-button'
import { SimpleSwapToken0Input } from './simple-swap-token0-input'
import { SimpleSwapToken1Input } from './simple-swap-token1-input'
import { SimpleSwapTradeButton } from './simple-swap-trade-button'
import { SimpleSwapTradeStats } from './simple-swap-trade-stats'

export const SimpleSwapWidget = () => {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <SwapModeButtons />
        <SimpleSwapSettingsOverlay />
      </div>
      <SimpleSwapToken0Input />
      <SimpleSwapSwitchTokensButton />
      <div className="flex flex-col">
        <SimpleSwapToken1Input />
        <SimpleSwapTradeButton />
      </div>
      <SimpleSwapTradeStats />
    </div>
  )
}

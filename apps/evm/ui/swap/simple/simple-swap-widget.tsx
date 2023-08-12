import { SimpleSwapHeader } from './simple-swap-header'
import { SimpleSwapSwitchTokensButton } from './simple-swap-switch-tokens-button'
import { SimpleSwapToken0Input } from './simple-swap-token0-input'
import { SimpleSwapToken1Input } from './simple-swap-token1-input'
import { SimpleSwapTradeButton } from './simple-swap-trade-button'
import { SimpleSwapTradeStats } from './simple-swap-trade-stats'

export const SimpleSwapWidget = () => {
  return (
    <div className="flex flex-col gap-4">
      <SimpleSwapHeader />
      <SimpleSwapToken0Input />
      <SimpleSwapSwitchTokensButton />
      <SimpleSwapToken1Input />
      <SimpleSwapTradeButton />
      <SimpleSwapTradeStats />
    </div>
  )
}

import { StellarChainId } from 'sushi/stellar'
import { SwapModeButtons } from '~evm/[chainId]/(trade)/_ui/swap-mode-buttons'
import { SimpleSwapExecuteButton } from './simple-swap-execute-button'
import { SimpleSwapSettingsOverlay } from './simple-swap-settings-overlay'
import { SimpleSwapSwitchTokensButton } from './simple-swap-switch-tokens-button'
import { SimpleSwapToken0Input } from './simple-swap-token0-input'
import { SimpleSwapToken1Input } from './simple-swap-token1-input'
import { SimpleSwapTradeStats } from './simple-swap-trade-stats'

export const SimpleSwapWidget = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4 md:px-12 md:py-6 bg-secondary rounded-3xl border-accent border">
        <div className="flex items-center self-end w-full py-2 gap-1">
          <SwapModeButtons chainId={StellarChainId.STELLAR} />
          <SimpleSwapSettingsOverlay />
        </div>
        <SimpleSwapToken0Input />
        <SimpleSwapSwitchTokensButton />
        <div className="flex flex-col">
          <SimpleSwapToken1Input />
          <SimpleSwapExecuteButton />
          <SimpleSwapTradeStats />
        </div>
      </div>
    </div>
  )
}

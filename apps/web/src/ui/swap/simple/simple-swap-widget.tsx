import { classNames } from '@sushiswap/ui'
import { ChainId } from 'sushi/chain'
import { SwapModeButtons } from '../swap-mode-buttons'
import { SimpleSwapBanner } from './simple-swap-banner'
import { SimpleSwapHeader } from './simple-swap-header'
import { SimpleSwapSettingsOverlay } from './simple-swap-settings-overlay'
import { SimpleSwapSwitchTokensButton } from './simple-swap-switch-tokens-button'
import { SimpleSwapTokenNotFoundDialog } from './simple-swap-token-not-found-dialog'
import { SimpleSwapToken0Input } from './simple-swap-token0-input'
import { SimpleSwapToken1Input } from './simple-swap-token1-input'
import { SimpleSwapTradeButton } from './simple-swap-trade-button'
import { SimpleSwapTradeStats } from './simple-swap-trade-stats'
import { SwapMaintenanceMessage } from './swap-maintenance-message'

export const SimpleSwapWidget = ({ chainId }: { chainId: ChainId }) => {
  return (
    <div
      className={classNames(
        'flex flex-col gap-4',
        chainId === ChainId.KATANA &&
          'p-6 pt-0 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(15,23,42,0.8)] rounded-3xl backdrop-blur-2xl',
      )}
    >
      <SimpleSwapHeader />
      <div className="flex items-center justify-between">
        <SwapModeButtons />
        <SimpleSwapSettingsOverlay />
      </div>
      <SwapMaintenanceMessage />
      <SimpleSwapToken0Input />
      <SimpleSwapSwitchTokensButton />
      <div className="flex flex-col">
        <SimpleSwapToken1Input />
        <SimpleSwapTradeButton />
      </div>
      <SimpleSwapTradeStats />
      <SimpleSwapBanner />
      <SimpleSwapTokenNotFoundDialog />
    </div>
  )
}

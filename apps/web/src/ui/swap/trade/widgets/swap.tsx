import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'
import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner'
import { SimpleSwapSwitchTokensButton } from 'src/ui/swap/simple/simple-swap-switch-tokens-button'
import { SimpleSwapTokenNotFoundDialog } from 'src/ui/swap/simple/simple-swap-token-not-found-dialog'
import { SimpleSwapToken0Input } from 'src/ui/swap/simple/simple-swap-token0-input'
import { SimpleSwapToken1Input } from 'src/ui/swap/simple/simple-swap-token1-input'
import { SimpleSwapTradeButton } from 'src/ui/swap/simple/simple-swap-trade-button'
import { SimpleSwapTradeStats } from 'src/ui/swap/simple/simple-swap-trade-stats'
import { SwapMaintenanceMessage } from 'src/ui/swap/simple/swap-maintenance-message'

export const SwapWidget: FC<{ animated: boolean; isAdvanced?: boolean }> = ({
  animated,
  isAdvanced,
}) => {
  return (
    <div
      className={classNames('flex flex-col gap-4', {
        'animate-slide-secondary': animated,
      })}
    >
      <SwapMaintenanceMessage />
      <SimpleSwapToken0Input />
      <SimpleSwapSwitchTokensButton />
      <div className="flex flex-col">
        <SimpleSwapToken1Input />
        <SimpleSwapTradeButton />
      </div>
      {isAdvanced ? null : <SimpleSwapTradeStats />}
      <SimpleSwapBanner className="xl:hidden" />
      <SimpleSwapTokenNotFoundDialog />
    </div>
  )
}

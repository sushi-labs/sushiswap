import type { FC } from 'react'
import { SimpleSwapBanner } from '../../simple-swap-banner'
import { SimpleSwapSwitchTokensButton } from '../../simple-swap-switch-tokens-button'
import { SimpleSwapTokenNotFoundDialog } from '../../simple-swap-token-not-found-dialog'
import { SimpleSwapToken0Input } from '../../simple-swap-token0-input'
import { SimpleSwapToken1Input } from '../../simple-swap-token1-input'
import { SimpleSwapTradeButton } from '../../simple-swap-trade-button'
import { SimpleSwapTradeStats } from '../../simple-swap-trade-stats'
import { SwapMaintenanceMessage } from '../../swap-maintenance-message'

export const SwapWidget: FC<{ isAdvanced?: boolean }> = ({ isAdvanced }) => {
  return (
    <>
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
    </>
  )
}

import { type EdgeConfigValue, get } from '@vercel/edge-config'
import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay'
import { SimpleSwapSwitchTokensButton } from '../simple/simple-swap-switch-tokens-button'
import { SimpleSwapTokenNotFoundDialog } from '../simple/simple-swap-token-not-found-dialog'
import { SimpleSwapToken0Input } from '../simple/simple-swap-token0-input'
import { SimpleSwapToken1Input } from '../simple/simple-swap-token1-input'
import { SimpleSwapTradeButton } from '../simple/simple-swap-trade-button'
import { SimpleSwapTradeStats } from '../simple/simple-swap-trade-stats'
import { SwapMaintenanceMessage } from '../simple/swap-maintenance-message'
import { StrapiBanner } from '../strapi-banner/strapi-banner'
import type { SwapWidgetSlots } from './types'

export function getSimpleEdgeConfig(): Promise<EdgeConfigValue | undefined> {
  return get('swap')
}

export const simpleSlots: SwapWidgetSlots = {
  header: null,
  settings: <SimpleSwapSettingsOverlay />,
  content: (
    <>
      <SwapMaintenanceMessage />
      <SimpleSwapToken0Input />
      <SimpleSwapSwitchTokensButton />
      <div className="flex flex-col">
        <SimpleSwapToken1Input />
        <SimpleSwapTradeButton />
      </div>
      <SimpleSwapTradeStats />
      {/* <StrapiBanner /> */}
      <SimpleSwapTokenNotFoundDialog />
    </>
  ),
}

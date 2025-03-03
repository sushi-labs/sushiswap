import { type EdgeConfigValue, get } from '@vercel/edge-config'
import { CrossChainSwapHeader } from '../cross-chain/cross-chain-swap-header'
import { CrossChainSwapMaintenanceMessage } from '../cross-chain/cross-chain-swap-maintenance-message'
import { CrossChainSwapSettingsOverlay } from '../cross-chain/cross-chain-swap-settings-overlay'
import { CrossChainSwapSwitchTokensButton } from '../cross-chain/cross-chain-swap-switch-tokens-button'
import { CrossChainSwapTokenNotFoundDialog } from '../cross-chain/cross-chain-swap-token-not-found-dialog'
import { CrossChainSwapToken0Input } from '../cross-chain/cross-chain-swap-token0-input'
import { CrossChainSwapToken1Input } from '../cross-chain/cross-chain-swap-token1-input'
import { CrossChainSwapTradeButton } from '../cross-chain/cross-chain-swap-trade-button'
import { CrossChainSwapTradeStats } from '../cross-chain/cross-chain-swap-trade-stats'
import type { SwapWidgetSlots } from './types'

export function getCrossChainEdgeConfig(): Promise<
  EdgeConfigValue | undefined
> {
  return get('xswap')
}

export const crossChainSlots: SwapWidgetSlots = {
  header: null,
  settings: <CrossChainSwapSettingsOverlay />,
  content: (
    <>
      <CrossChainSwapMaintenanceMessage />
      <CrossChainSwapToken0Input />
      <CrossChainSwapSwitchTokensButton />
      <div className="flex flex-col">
        <CrossChainSwapToken1Input />
        <CrossChainSwapTradeButton />
      </div>
      <CrossChainSwapTradeStats />
      <CrossChainSwapTokenNotFoundDialog />
    </>
  ),
}

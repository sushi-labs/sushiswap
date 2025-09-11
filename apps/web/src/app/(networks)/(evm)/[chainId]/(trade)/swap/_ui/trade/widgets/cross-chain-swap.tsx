'use client'

import { CrossChainSwapMaintenanceMessage } from '~evm/[chainId]/(trade)/cross-chain-swap/_ui/cross-chain-swap-maintenance-message'
import { CrossChainSwapSwitchTokensButton } from '~evm/[chainId]/(trade)/cross-chain-swap/_ui/cross-chain-swap-switch-tokens-button'
import { CrossChainSwapTokenNotFoundDialog } from '~evm/[chainId]/(trade)/cross-chain-swap/_ui/cross-chain-swap-token-not-found-dialog'
import { CrossChainSwapToken0Input } from '~evm/[chainId]/(trade)/cross-chain-swap/_ui/cross-chain-swap-token0-input'
import { CrossChainSwapToken1Input } from '~evm/[chainId]/(trade)/cross-chain-swap/_ui/cross-chain-swap-token1-input'
import { CrossChainSwapTradeButton } from '~evm/[chainId]/(trade)/cross-chain-swap/_ui/cross-chain-swap-trade-button'
import { CrossChainSwapTradeStats } from '~evm/[chainId]/(trade)/cross-chain-swap/_ui/cross-chain-swap-trade-stats'
import { SimpleSwapBridgeBanner } from '../../simple-swap-bridge-banner'

export const CrossChainSwapWidget = ({
  isAdvanced,
}: { isAdvanced?: boolean }) => {
  return (
    <>
      <CrossChainSwapMaintenanceMessage />
      <CrossChainSwapToken0Input />
      <CrossChainSwapSwitchTokensButton />

      <div className="flex flex-col">
        <CrossChainSwapToken1Input />
        <CrossChainSwapTradeButton />

        {isAdvanced ? null : <CrossChainSwapTradeStats />}
        <SimpleSwapBridgeBanner className="xl:hidden" />
        <CrossChainSwapTokenNotFoundDialog />
      </div>
    </>
  )
}

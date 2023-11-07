import { Amount, Native } from 'sushi/currency'
import { CrossChainBanner } from '../cross-chain-banner'
import { SwapModeButtons } from '../swap-mode-buttons'
import { CrossChainSwapHeader } from './cross-chain-swap-header'
import { CrossChainSwapMaintenanceMessage } from './cross-chain-swap-maintenance-message'
import { CrossChainSwapPendingCardList } from './cross-chain-swap-pending-card-list'
import { useCrossChainSwapPendingTransactionsActions } from './cross-chain-swap-pending-transactions-provider'
import { CrossChainSwapSettingsOverlay } from './cross-chain-swap-settings-overlay'
import { CrossChainSwapSwitchTokensButton } from './cross-chain-swap-switch-tokens-button'
import { CrossChainSwapTokenNotFoundDialog } from './cross-chain-swap-token-not-found-dialog'
import { CrossChainSwapToken0Input } from './cross-chain-swap-token0-input'
import { CrossChainSwapToken1Input } from './cross-chain-swap-token1-input'
import { CrossChainSwapTradeButton } from './cross-chain-swap-trade-button'
import { CrossChainSwapTradeStats } from './cross-chain-swap-trade-stats'
import { ChainId } from 'sushi/chain'
import { useEffect } from 'react'

export const CrossChainSwapWidget = () => {
  // const { push } = useCrossChainSwapPendingTransactionsActions()
  //
  // useEffect(() => {
  //   push({
  //     tradeId: 'test',
  //     chainId0: ChainId.ETHEREUM,
  //     chainId1: ChainId.AVALANCHE,
  //     txHash:
  //       '0xf5fe3c5d006e02b77b2c22f36d95ce57b116f8ca1efa9bc8c738016fd0d78727',
  //     amountIn: Amount.fromRawAmount(Native.onChain(ChainId.ETHEREUM), 100),
  //     amountOut: Amount.fromRawAmount(Native.onChain(ChainId.AVALANCHE), 100),
  //   })
  // }, [push])

  return (
    <div className="flex flex-col gap-4">
      <CrossChainSwapHeader />
      <div className="flex items-center justify-between">
        <SwapModeButtons />
        <CrossChainSwapSettingsOverlay />
      </div>
      <CrossChainSwapMaintenanceMessage />
      <CrossChainBanner />
      <CrossChainSwapToken0Input />
      <CrossChainSwapSwitchTokensButton />
      <div className="flex flex-col">
        <CrossChainSwapToken1Input />
        <CrossChainSwapTradeButton />
      </div>
      <CrossChainSwapTradeStats />
      <CrossChainSwapTokenNotFoundDialog />
      <CrossChainSwapPendingCardList />
    </div>
  )
}

'use client'

import { FunButton } from 'src/ui/funkit/Button'
import { CrossChainSwapMaintenanceMessage } from 'src/ui/swap/cross-chain/cross-chain-swap-maintenance-message'
import { CrossChainSwapSwitchTokensButton } from 'src/ui/swap/cross-chain/cross-chain-swap-switch-tokens-button'
import { CrossChainSwapTokenNotFoundDialog } from 'src/ui/swap/cross-chain/cross-chain-swap-token-not-found-dialog'
import { CrossChainSwapToken0Input } from 'src/ui/swap/cross-chain/cross-chain-swap-token0-input'
import { CrossChainSwapToken1Input } from 'src/ui/swap/cross-chain/cross-chain-swap-token1-input'
import { CrossChainSwapTradeButton } from 'src/ui/swap/cross-chain/cross-chain-swap-trade-button'
import { CrossChainSwapTradeStats } from 'src/ui/swap/cross-chain/cross-chain-swap-trade-stats'
import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner'
import { useAccount } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useDerivedStateSimpleSwap } from '../../simple/derivedstate-simple-swap-provider'

export const CrossChainSwapWidget = ({
  isAdvanced,
}: {
  isAdvanced?: boolean
}) => {
  const {
    state: { swapAmountString, chainId0: chainId, token0, swapAmount },
  } = useDerivedStateSimpleSwap()

  const { address } = useAccount()
  const { data: balance } = useAmountBalance(token0)

  const insufficientBalance =
    address && balance && swapAmount && balance.lessThan(swapAmount)

  return (
    <>
      <CrossChainSwapMaintenanceMessage />
      <CrossChainSwapToken0Input />
      <CrossChainSwapSwitchTokensButton />

      <div className="flex flex-col">
        <CrossChainSwapToken1Input />
        <CrossChainSwapTradeButton />

        <FunButton
          targetAssetAmount={Number(swapAmountString)}
          targetAssetAddress={token0?.wrapped.address || ''}
          targetAssetTicker={token0?.symbol || ''}
          targetChain={chainId}
          size="xl"
          className="mt-4"
          variant={insufficientBalance ? 'default' : 'secondary'}
          disabled={
            !token0 || !swapAmountString || Number(swapAmountString) <= 0
          }
        />

        {isAdvanced ? null : <CrossChainSwapTradeStats />}
        <SimpleSwapBanner className="xl:hidden" />
        <CrossChainSwapTokenNotFoundDialog />
      </div>
    </>
  )
}

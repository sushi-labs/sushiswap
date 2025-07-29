'use client'

import type { FC } from 'react'
import { FunButton } from 'src/ui/funkit/Button'
import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner'
import { SimpleSwapSwitchTokensButton } from 'src/ui/swap/simple/simple-swap-switch-tokens-button'
import { SimpleSwapTokenNotFoundDialog } from 'src/ui/swap/simple/simple-swap-token-not-found-dialog'
import { SimpleSwapToken0Input } from 'src/ui/swap/simple/simple-swap-token0-input'
import { SimpleSwapToken1Input } from 'src/ui/swap/simple/simple-swap-token1-input'
import { SimpleSwapTradeButton } from 'src/ui/swap/simple/simple-swap-trade-button'
import { SimpleSwapTradeStats } from 'src/ui/swap/simple/simple-swap-trade-stats'
import { SwapMaintenanceMessage } from 'src/ui/swap/simple/swap-maintenance-message'
import { useAccount } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useDerivedStateSimpleSwap } from '../../simple/derivedstate-simple-swap-provider'

export const SwapWidget: FC<{ isAdvanced?: boolean }> = ({ isAdvanced }) => {
  const {
    state: { swapAmountString, chainId0: chainId, token0, swapAmount },
  } = useDerivedStateSimpleSwap()

  const { address } = useAccount()
  const { data: balance } = useAmountBalance(token0)

  const insufficientBalance =
    address && balance && swapAmount && balance.lessThan(swapAmount)

  return (
    <>
      <SwapMaintenanceMessage />
      <SimpleSwapToken0Input />
      <SimpleSwapSwitchTokensButton />

      <div className="flex flex-col">
        <SimpleSwapToken1Input />

        {!insufficientBalance && <SimpleSwapTradeButton />}

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

        {!isAdvanced && <SimpleSwapTradeStats />}

        <SimpleSwapBanner className="xl:hidden" />

        <SimpleSwapTokenNotFoundDialog />
      </div>
    </>
  )
}

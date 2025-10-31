'use client'

import { DialogTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { type FC, useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { isChainIdSupportedByWallet } from 'src/lib/wagmi/config/wallet'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker/slippage'
import { ZERO } from 'sushi'
import { useAccount } from 'wagmi'
import { CrossChainSwapChainUnsupportedMessage } from './cross-chain-swap-chain-unsupported-message'
import { CrossChainSwapTradeReviewDialog } from './cross-chain-swap-trade-review-dialog'
import {
  useDerivedStateCrossChainSwap,
  useSelectedCrossChainTradeRoute,
} from './derivedstate-cross-chain-swap-provider'
import { useIsCrossChainSwapMaintenance } from './use-is-cross-chain-swap-maintenance'

export const CrossChainSwapTradeButton: FC = () => {
  const { data: maintenance } = useIsCrossChainSwapMaintenance()
  const {
    state: { swapAmount, swapAmountString, chainId0, chainId1 },
  } = useDerivedStateCrossChainSwap()
  const { data: route, isError } = useSelectedCrossChainTradeRoute()
  const [checked, setChecked] = useState(false)
  const [slippagePercent] = useSlippageTolerance()

  const { connector } = useAccount()

  const showChainUnsupportedWarning = useMemo(
    () =>
      connector?.id
        ? !isChainIdSupportedByWallet({
            chainId: chainId1,
            walletId: connector.id,
          })
        : false,
    [chainId1, connector?.id],
  )

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(route?.priceImpact)
    return priceImpactSeverity > 3
  }, [route?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [slippagePercent])

  // Reset
  useEffect(() => {
    if (checked && !showPriceImpactWarning) {
      setChecked(false)
    }
  }, [showPriceImpactWarning, checked])

  return (
    <CrossChainSwapTradeReviewDialog>
      <div>
        <Checker.Guard
          guardWhen={maintenance}
          guardText="Maintenance in progress"
        >
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={chainId0}>
              <Checker.Amounts fullWidth chainId={chainId0} amount={swapAmount}>
                <Checker.Slippage
                  fullWidth
                  text="Swap With High Slippage"
                  slippageTolerance={slippagePercent}
                >
                  <Checker.ApproveERC20
                    id="approve-erc20"
                    fullWidth
                    amount={swapAmount}
                    contract={route?.step?.estimate?.approvalAddress}
                  >
                    <Checker.Success tag={APPROVE_TAG_XSWAP}>
                      <DialogTrigger asChild>
                        <Button
                          disabled={Boolean(
                            !route?.amountOut?.gt(ZERO) ||
                              isError ||
                              +swapAmountString === 0 ||
                              (!checked && showPriceImpactWarning) ||
                              showChainUnsupportedWarning,
                          )}
                          color={showPriceImpactWarning ? 'red' : 'blue'}
                          fullWidth
                          size="xl"
                          testId="swap"
                        >
                          {!checked && showPriceImpactWarning
                            ? 'Price impact too high'
                            : isError
                              ? 'No trade found'
                              : 'Swap'}
                        </Button>
                      </DialogTrigger>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Slippage>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </Checker.Guard>
      </div>
      {showChainUnsupportedWarning && (
        <CrossChainSwapChainUnsupportedMessage
          className="mt-4"
          walletName={connector?.name}
        />
      )}
      {showSlippageWarning && <SlippageWarning className="mt-4" />}
      {showPriceImpactWarning && (
        <PriceImpactWarning
          className="mt-4"
          checked={checked}
          setChecked={setChecked}
        />
      )}
    </CrossChainSwapTradeReviewDialog>
  )
}

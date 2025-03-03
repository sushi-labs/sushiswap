'use client'

import { DialogTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React, { type FC, useEffect, useMemo, useState } from 'react'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { ZERO } from 'sushi/math'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import { CrossChainSwapTradeReviewDialog } from './cross-chain-swap-trade-review-dialog'
import {
  useDerivedStateCrossChainSwap,
  useSelectedCrossChainTradeRoute,
} from './derivedstate-cross-chain-swap-context'
import { useIsCrossChainSwapMaintenance } from './use-is-cross-chain-swap-maintenance'

export const CrossChainSwapTradeButton: FC = () => {
  const { data: maintenance } = useIsCrossChainSwapMaintenance()
  const {
    state: { swapAmount, swapAmountString, chainId0 },
  } = useDerivedStateCrossChainSwap()
  const { data: route, isError } = useSelectedCrossChainTradeRoute()
  const [checked, setChecked] = useState(false)

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(route?.priceImpact)
    return priceImpactSeverity > 3
  }, [route?.priceImpact])

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
                          !route?.amountOut?.greaterThan(ZERO) ||
                            isError ||
                            +swapAmountString === 0 ||
                            (!checked && showPriceImpactWarning),
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
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </Checker.Guard>
      </div>
      {showPriceImpactWarning && (
        <div className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20">
          <input
            id="expert-checkbox"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <label
            htmlFor="expert-checkbox"
            className="ml-2 font-medium text-red-600"
          >
            Price impact is too high. You will lose a big portion of your funds
            in this trade. Please tick the box if you would like to continue.
          </label>
        </div>
      )}
    </CrossChainSwapTradeReviewDialog>
  )
}

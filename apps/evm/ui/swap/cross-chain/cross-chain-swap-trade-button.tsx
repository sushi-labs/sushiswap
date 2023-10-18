'use client'

import { BENTOBOX_ADDRESS, BentoBoxChainId } from 'sushi/config'
import { ZERO } from 'sushi/math'
import { SUSHIXSWAP_ADDRESS, SushiXSwapChainId } from 'sushi/config'
import { DialogTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Checker } from '@sushiswap/wagmi/systems'
import { APPROVE_TAG_XSWAP } from 'lib/constants'
import React, { FC, useEffect, useState } from 'react'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import { CrossChainSwapTradeReviewDialog } from './cross-chain-swap-trade-review-dialog'
import {
  useCrossChainSwapTrade,
  useDerivedStateCrossChainSwap,
} from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapTradeButton: FC = () => {
  const {
    state: { swapAmount, swapAmountString, chainId0, maintenance },
  } = useDerivedStateCrossChainSwap()
  const { data: trade } = useCrossChainSwapTrade()
  const [checked, setChecked] = useState(false)

  // Reset
  useEffect(() => {
    if (warningSeverity(trade?.priceImpact) <= 3) {
      setChecked(false)
    }
  }, [trade])

  return (
    <CrossChainSwapTradeReviewDialog>
      <div>
        <Checker.Guard
          guardWhen={maintenance}
          guardText="Maintenance in progress"
        >
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={chainId0}>
              <Checker.Amounts
                fullWidth
                chainId={chainId0}
                amounts={[swapAmount]}
              >
                <Checker.ApproveBentobox
                  tag={APPROVE_TAG_XSWAP}
                  fullWidth
                  chainId={chainId0 as BentoBoxChainId}
                  id="approve-bentobox"
                  masterContract={
                    SUSHIXSWAP_ADDRESS[chainId0 as SushiXSwapChainId]
                  }
                >
                  <Checker.ApproveERC20
                    id="approve-erc20"
                    fullWidth
                    amount={swapAmount}
                    contract={BENTOBOX_ADDRESS[chainId0 as BentoBoxChainId]}
                  >
                    <Checker.Success tag={APPROVE_TAG_XSWAP}>
                      <DialogTrigger asChild>
                        <Button
                          disabled={Boolean(
                            !trade?.amountOut?.greaterThan(ZERO) ||
                              trade?.route?.status === 'NoWay' ||
                              +swapAmountString === 0 ||
                              (!checked &&
                                warningSeverity(trade?.priceImpact) > 3),
                          )}
                          color={
                            warningSeverity(trade?.priceImpact) >= 3
                              ? 'red'
                              : 'blue'
                          }
                          fullWidth
                          size="xl"
                        >
                          {!checked && warningSeverity(trade?.priceImpact) >= 3
                            ? 'Price impact too high'
                            : trade?.route?.status === 'NoWay'
                            ? 'No trade found'
                            : 'Swap'}
                        </Button>
                      </DialogTrigger>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.ApproveBentobox>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </Checker.Guard>
      </div>
      {warningSeverity(trade?.priceImpact) > 3 && (
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

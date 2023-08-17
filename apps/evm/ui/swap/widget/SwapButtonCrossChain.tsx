import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ZERO } from '@sushiswap/math'
import { sushiXSwapAddress, SushiXSwapChainId } from '@sushiswap/sushixswap'
import { Button } from '@sushiswap/ui/components/button'
import { Checker } from '@sushiswap/wagmi/future/systems'
import React, { FC, useEffect, useState } from 'react'

import { useTrade } from '../../../lib/swap/useTrade'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'

export const APPROVE_XSWAP_TAG = 'APPROVE_XSWAP_TAG'

export const SwapButtonCrossChain: FC = () => {
  const { amount, network0, network1, value } = useSwapState()
  const { isFetching, isLoading, data: trade } = useTrade({ crossChain: network0 !== network1 })
  const { setReview } = useSwapActions()
  const [checked, setChecked] = useState(false)

  // Reset
  useEffect(() => {
    if (warningSeverity(trade?.priceImpact) <= 3) {
      setChecked(false)
    }
  }, [trade])

  return (
    <>
      <div className="pt-4">
        <Checker.Connect fullWidth>
          <Checker.Network fullWidth chainId={network0}>
            <Checker.Amounts fullWidth chainId={network0} amounts={[amount]}>
              <Checker.ApproveBentobox
                tag={APPROVE_XSWAP_TAG}
                fullWidth
                chainId={network0 as BentoBoxV1ChainId}
                id="approve-bentobox"
                masterContract={sushiXSwapAddress[network0 as SushiXSwapChainId]}
              >
                <Checker.ApproveERC20
                  id="approve-erc20"
                  fullWidth
                  amount={amount}
                  contract={bentoBoxV1Address[network0 as BentoBoxV1ChainId]}
                >
                  <Checker.Success tag={APPROVE_XSWAP_TAG}>
                    <Button
                      disabled={
                        !trade?.amountOut?.greaterThan(ZERO) ||
                        trade?.route?.status === 'NoWay' ||
                        Boolean(isLoading && +value > 0) ||
                        isFetching ||
                        (!checked && warningSeverity(trade?.priceImpact) > 3)
                      }
                      color={warningSeverity(trade?.priceImpact) >= 3 ? 'red' : 'blue'}
                      fullWidth
                      onClick={() => setReview(true)}
                      size="xl"
                    >
                      {!checked && warningSeverity(trade?.priceImpact) >= 3
                        ? 'Price impact too high'
                        : trade?.route?.status === 'NoWay'
                        ? 'No trade found'
                        : 'Swap'}
                    </Button>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.ApproveBentobox>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connect>
      </div>
      {warningSeverity(trade?.priceImpact) > 3 && (
        <div className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20">
          <input
            id="expert-checkbox"
            testdata-id="price-impact-checkbox"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
          <label htmlFor="expert-checkbox" className="ml-2 font-medium text-red-600">
            Price impact is too high. You will lose a big portion of your funds in this trade. Please tick the box if
            you would like to continue.
          </label>
        </div>
      )}
    </>
  )
}

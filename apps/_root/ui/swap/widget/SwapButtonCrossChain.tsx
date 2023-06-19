import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC, useEffect, useState } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { useTrade } from '../../../lib/swap/useTrade'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { sushiXSwapAddress, SushiXSwapChainId } from '@sushiswap/sushixswap'
import { ZERO } from '@sushiswap/math'

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
        <Checker.Connect fullWidth size="xl" color="blue" variant="filled">
          <Checker.Network fullWidth size="xl" chainId={network0}>
            <Checker.Amounts fullWidth size="xl" chainId={network0} amounts={[amount]}>
              <Checker.ApproveBentobox
                tag={APPROVE_XSWAP_TAG}
                fullWidth
                size="xl"
                chainId={network0 as BentoBoxV1ChainId}
                id="approve-bentobox"
                masterContract={sushiXSwapAddress[network0 as SushiXSwapChainId]}
              >
                <Checker.ApproveERC20
                  id="approve-erc20"
                  fullWidth
                  size="xl"
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
                      size="xl"
                      onClick={() => setReview(true)}
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

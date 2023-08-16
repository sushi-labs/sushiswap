import { Native } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import {
  isRouteProcessor3ChainId,
  isRouteProcessorChainId,
  routeProcessor3Address,
  routeProcessorAddress,
} from '@sushiswap/route-processor'
import { Button } from '@sushiswap/ui/components/button'
import { AppType } from '@sushiswap/ui/types'
import { Checker } from '@sushiswap/wagmi/future/systems'
import React, { FC, useEffect, useState } from 'react'

import { useTrade } from '../../../lib/swap/useTrade'
import { warningSeverity } from '../../../lib/swap/warningSeverity'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'

export const SwapButton: FC = () => {
  const { appType, amount, network0, network1, value, token0, token1 } = useSwapState()
  const { isFetching, isLoading, data: trade } = useTrade({ crossChain: network0 !== network1 })
  const { setReview } = useSwapActions()
  const [checked, setChecked] = useState(false)

  const isWrap =
    appType === AppType.Swap && token0?.isNative && token1?.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1?.isNative && token0?.wrapped.address === Native.onChain(network0).wrapped.address

  // Reset
  useEffect(() => {
    if (warningSeverity(trade?.priceImpact) <= 3) {
      setChecked(false)
    }
  }, [trade])

  console.log(trade?.route?.status)
  return (
    <>
      <div className="pt-4">
        <Checker.Connect>
          <Checker.Network chainId={network0}>
            <Checker.Amounts chainId={network0} amounts={[amount]}>
              <Checker.ApproveERC20
                id="approve-erc20"
                amount={amount}
                contract={
                  isRouteProcessor3ChainId(network0)
                    ? routeProcessor3Address[network0]
                    : isRouteProcessorChainId(network0)
                    ? routeProcessorAddress[network0]
                    : undefined
                }
              >
                <Checker.Success tag="swap">
                  <Button
                    size="xl"
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
                    testId="swap"
                  >
                    {!checked && warningSeverity(trade?.priceImpact) >= 3
                      ? 'Price impact too high'
                      : trade?.route?.status === 'NoWay'
                      ? 'No trade found'
                      : isWrap
                      ? 'Wrap'
                      : isUnwrap
                      ? 'Unwrap'
                      : 'Swap'}
                  </Button>
                </Checker.Success>
              </Checker.ApproveERC20>
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

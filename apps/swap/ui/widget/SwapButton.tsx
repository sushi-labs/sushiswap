'use client'

import { Button } from '@sushiswap/ui13/components/button'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { ApprovalState, ApproveTokenController, Checker } from '@sushiswap/wagmi13'
import { ChainId } from '@sushiswap/chain'
import { useTrade } from '../../lib/useTrade'
import { Native } from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui13/types'
import { getRouteProcessorAddressForChainId } from 'lib/getRouteProcessorAddressForChainId'
import { Popover, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { warningSeverity } from '../../lib/warningSeverity'

export const SwapButton: FC = () => {
  const { appType, amount, network0, value, token0, token1 } = useSwapState()
  const { isFetching, isLoading, data: trade } = useTrade()
  const { setReview } = useSwapActions()
  const [checked, setChecked] = useState(false)

  const isWrap =
    appType === AppType.Swap && token0.isNative && token1.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1.isNative && token0.wrapped.address === Native.onChain(network0).wrapped.address

  // Reset
  useEffect(() => {
    if (warningSeverity(trade?.priceImpact) < 3) {
      setChecked(false)
    }
  }, [trade])

  return (
    <>
      <div className="pt-4">
        <Checker.Network fullWidth size="xl" chainId={network0}>
          <Checker.Amounts fullWidth size="xl" chainId={network0} amounts={[amount]}>
            <Checker.ApproveERC20
              id="approve-erc20"
              fullWidth
              size="xl"
              amount={amount}
              contract={getRouteProcessorAddressForChainId(network0)}
            >
              <Button
                disabled={
                  Boolean(isLoading && +value > 0) ||
                  isFetching ||
                  (!checked && warningSeverity(trade?.priceImpact) >= 3)
                }
                color={!checked && warningSeverity(trade?.priceImpact) >= 3 ? 'red' : 'blue'}
                fullWidth
                size="xl"
                onClick={() => setReview(true)}
              >
                {!checked && warningSeverity(trade?.priceImpact) >= 3
                  ? 'Price impact too high'
                  : isWrap
                  ? 'Wrap'
                  : isUnwrap
                  ? 'Unwrap'
                  : 'Swap'}
              </Button>
            </Checker.ApproveERC20>
          </Checker.Amounts>
        </Checker.Network>
      </div>
      {warningSeverity(trade?.priceImpact) >= 3 && (
        <div className="rounded-xl px-4 py-3 bg-red/20 mt-4 flex items-start">
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

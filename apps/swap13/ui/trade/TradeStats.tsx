'use client'

import { Transition } from '@headlessui/react'
import { formatNumber, formatPercent, shortenAddress } from '@sushiswap/format'
import { useSlippageTolerance } from '@sushiswap/react-query'
import React, { FC } from 'react'

import { useSwapState } from './TradeProvider'
import { useTrade } from '../../lib/useTrade'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import numeral from 'numeral'
import { Button } from '@sushiswap/ui13/components/button'

export const TradeStats: FC = () => {
  const { value, token0, token1, recipient } = useSwapState()
  const { data: slippageTolerance } = useSlippageTolerance()
  const { isLoading, data: trade } = useTrade()
  return (
    <Transition
      show={!!value}
      enter="transition duration-300 ease-out"
      enterFrom="transform translate-y-[16px] opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-300 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-[16px] opacity-0"
    >
      <div className="w-full px-3 flex flex-col gap-1">
        {/* <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Price Impact</span>
          <span className="text-sm font-semibold text-green text-right">
            {isLoading ? (
              <Skeleton.Box className="h-4 py-0.5 w-[60px] rounded-md" />
            ) : (
              `${numeral(trade?.priceImpact ?? 0).format('0.00%')}`
            )}
          </span>
        </div> */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Minimum received</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading ? (
              <Skeleton.Box className="h-4 py-0.5 w-[60px] rounded-md" />
            ) : (
              `${trade?.minAmountOut?.toSignificant(6) ?? '0.00'} ${token1.symbol}`
            )}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Slippage tolerance</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Transaction cost</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading ? <Skeleton.Box className="h-4 py-0.5 w-[60px] rounded-md" /> : `~$${trade?.gasSpent ?? '0.00'}`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Route</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {isLoading ? (
              <Skeleton.Box className="h-4 py-0.5 w-[60px] rounded-md" />
            ) : (
              <button type="button">{`${token0?.symbol} > ${token1?.symbol}`}</button>
            )}
          </span>
        </div>
        <div className="h-[2px] bg-gray-200 dark:bg-slate-800 w-full my-3" />
        <div className="flex justify-between items-start gap-2">
          <span className="font-medium text-gray-900 dark:text-slate-100 mt-px">Expected output</span>
          <div className="flex flex-col justify-end">
            <span className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              {isLoading ? (
                <Skeleton.Box className="h-[20px] my-[4px] w-[150px] rounded-md" />
              ) : (
                `${trade?.amountOut?.toSignificant(6) ?? '0.00'} ${token1.symbol}`
              )}
            </span>
            {recipient && (
              <span className="text-xs font-medium text-gray-900 text-right dark:text-slate-100">
                to: {shortenAddress(recipient)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Transition>
  )
}

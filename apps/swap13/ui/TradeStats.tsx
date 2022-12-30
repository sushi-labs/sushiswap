'use client'

import { Transition } from '@headlessui/react'
import { shortenAddress } from '@sushiswap/format'
import { FC } from 'react'

import { useSwapState } from './TradeProvider'

export const TradeStats: FC = () => {
  const { value, token1, recipient } = useSwapState()

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
        <div className="flex justify-between">
          <span className="text-sm text-gray-700 dark:text-slate-400">Price Impact</span>
          <span className="text-sm font-semibold text-green text-right">-0.08%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-700 dark:text-slate-400">Network Fee</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">~$1.18</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-700 dark:text-slate-400">Minimum received after slippage</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            8.21408 {token1.symbol}
          </span>
        </div>
        <div className="h-[2px] bg-gray-200 dark:bg-slate-800 w-full my-3" />
        <div className="flex justify-between items-start">
          <span className="font-medium text-gray-900 dark:text-slate-100">Expected output</span>
          <div className="flex flex-col justify-end">
            <span className="text-xl font-semibold text-gray-900 dark:text-slate-100">8.38338 {token1.symbol}</span>
            {recipient && (
              <span className="text-xs font-medium text-gray-900 text-right dark:text-slate-100">
                {shortenAddress(recipient)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Transition>
  )
}

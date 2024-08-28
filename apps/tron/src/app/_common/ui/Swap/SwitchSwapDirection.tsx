import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useSwapDispatch } from '~tron/swap/swap-provider'

export const SwitchSwapDirection = () => {
  const { swapTokens } = useSwapDispatch()
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      <button
        type="button"
        onClick={swapTokens}
        className="z-10 group bg-gray-100 dark:bg-slate-900 p-2 border dark:border-slate-700 transition-all rounded-full cursor-pointer"
      >
        <div className="transition-transform rotate-0 group-hover:rotate-180">
          <ArrowsUpDownIcon strokeWidth={2} className="w-3 h-3 text-blue" />
        </div>
      </button>
    </div>
  )
}

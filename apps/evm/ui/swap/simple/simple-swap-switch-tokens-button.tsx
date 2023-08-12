'use client'

import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'

import { useDerivedStateSimpleSwap } from './derivedstate-simpleswap-provider'

export const SimpleSwapSwitchTokensButton = () => {
  const {
    mutate: { switchTokens },
  } = useDerivedStateSimpleSwap()

  return (
    <div className="left-0 right-0 mt-[-26px] mb-[-26px] flex items-center justify-center">
      <button
        onClick={switchTokens}
        type="button"
        className="hover:shadow-sm transition-border z-10 group bg-background p-2 border border-transparent hover:border-accent transition-all rounded-full cursor-pointer"
      >
        <div className="transition-transform rotate-0 group-hover:rotate-180">
          <ArrowsUpDownIcon strokeWidth={3} className="w-4 h-4 text-blue" />
        </div>
      </button>
    </div>
  )
}

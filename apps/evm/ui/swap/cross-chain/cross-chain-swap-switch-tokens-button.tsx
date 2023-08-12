'use client'

import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'

import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapSwitchTokensButton = () => {
  const {
    mutate: { switchTokens },
  } = useDerivedStateCrossChainSwap()

  return (
    <div className="left-0 right-0 mt-[-26px] mb-[-26px] flex items-center justify-center">
      <button
        onClick={switchTokens}
        type="button"
        className="hover:shadow-sm transition-border z-10 group bg-background p-1.5 border border-accent transition-all rounded-full cursor-pointer"
      >
        <div className="transition-transform rotate-0 group-hover:rotate-180">
          <ArrowsUpDownIcon strokeWidth={3} className="w-3 h-3 text-blue" />
        </div>
      </button>
    </div>
  )
}

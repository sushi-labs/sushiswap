'use client'

import { ArrowDownIcon } from '@heroicons/react-v1/solid'
import { IconButton } from '@sushiswap/ui'
import { useStellarCrossChainSwap } from './cross-chain-swap-provider'

export function CrossChainSwapSwitchTokensButton() {
  const {
    mutate: { switchTokens },
  } = useStellarCrossChainSwap()

  return (
    <div className="flex items-center justify-center -my-3 z-10">
      <IconButton
        icon={ArrowDownIcon}
        onClick={switchTokens}
        name="Switch tokens"
        variant="outline"
        className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-full"
      />
    </div>
  )
}

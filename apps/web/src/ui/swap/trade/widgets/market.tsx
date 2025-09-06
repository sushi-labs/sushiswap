import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'
import { useIsCrossChain } from 'src/lib/hooks/useIsCrossChain'
import { CrossChainSwapWidget } from './cross-chain-swap'
import { SwapWidget } from './swap'

export const MarketWidget: FC<{ animated: boolean; isAdvanced?: boolean }> = ({
  animated,
  isAdvanced,
}) => {
  const { isCrossChain } = useIsCrossChain()

  return (
    <div
      className={classNames('flex flex-col gap-4', {
        'animate-slide-secondary': animated,
      })}
    >
      {isCrossChain ? (
        <CrossChainSwapWidget isAdvanced={isAdvanced} />
      ) : (
        <SwapWidget isAdvanced={isAdvanced} />
      )}
    </div>
  )
}

import {
  SkeletonBox,
  SkeletonChartLoadingStateMask,
  SkeletonChartXAxe,
  SkeletonText,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { type ChainId, EvmChain } from 'sushi/chain'

export function SkeletonChart({ type }: { type: 'area' | 'bar' }) {
  const height = 400

  return (
    <div className="relative flex flex-row">
      <svg
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <SkeletonChartLoadingStateMask type={type} height={height - 40} />
        <SkeletonChartXAxe height={height - 32} />
      </svg>
    </div>
  )
}

export const GlobalStatsLoading: FC<{ chainId: ChainId }> = ({ chainId }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">
            {EvmChain.from(chainId)?.name} T0
          </span>
          <SkeletonBox className="!w-36 h-[36px]" />
          <SkeletonBox className="!w-40 h-[20px]" />
        </div>
        <SkeletonChart type="area" />
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">Volume</span>
          <SkeletonBox className="!w-36 h-[36px]" />
          <SkeletonBox className="!w-40 h-[20px]" />
        </div>
        <SkeletonChart type="bar" />
      </div>
    </div>
  )
}

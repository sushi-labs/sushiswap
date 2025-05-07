import { SkeletonChart, SkeletonText } from '@sushiswap/ui'
import type { FC } from 'react'
import { type ChainId, EvmChain } from 'sushi/chain'

export const GlobalStatsLoading: FC<{ chainId: ChainId }> = ({ chainId }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">
            {EvmChain.from(chainId)?.name} TVL
          </span>
          <SkeletonText fontSize="3xl" className="!w-36" />
          <SkeletonText fontSize="sm" className="!w-40" />
        </div>
        <div className="pb-10">
          <SkeletonChart type="area" height={360} />
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">
            {EvmChain.from(chainId)?.name} Volume
          </span>
          <SkeletonText fontSize="3xl" className="!w-36" />
          <SkeletonText fontSize="sm" className="!w-40" />
        </div>
        <div className="pb-10">
          <SkeletonChart type="bar" height={360} />
        </div>
      </div>
    </div>
  )
}

'use client'

import {
  type PoolChainId,
  getAnalyticsDayBuckets,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { type FC, Suspense } from 'react'
import { useDexMetrics } from '~kadena/_common/lib/hooks/use-dex-metrics'
import { GlobalStatsLoading } from './GlobalStatsLoading'
import { TVLChart } from './TVLChart'
import { VolumeChart } from './VolumeChart'
export const GlobalStatsCharts: FC = () => {
  return <_GlobalStatsCharts chainId={1} />
}

const _GlobalStatsCharts: FC<{ chainId: PoolChainId }> = () => {
  const { data: dexMetrics, isLoading } = useDexMetrics()

  return isLoading ? (
    <GlobalStatsLoading />
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <TVLChart data={dexMetrics} />
      <VolumeChart data={dexMetrics} />
    </div>
  )
}

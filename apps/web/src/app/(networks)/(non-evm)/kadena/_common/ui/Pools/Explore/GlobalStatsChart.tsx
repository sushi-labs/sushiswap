import {
  type PoolChainId,
  getAnalyticsDayBuckets,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { type FC, Suspense } from 'react'
import { GlobalStatsLoading } from './GlobalStatsLoading'
import { TVLChart } from './TVLChart'
import { VolumeChart } from './VolumeChart'

export const GlobalStatsCharts: FC = () => {
  return <_GlobalStatsCharts chainId={1} />
}

const _GlobalStatsCharts: FC<{ chainId: PoolChainId }> = async ({
  chainId,
}) => {
  const dayBuckets = await unstable_cache(
    async () =>
      getAnalyticsDayBuckets({
        chainId,
      }),
    ['dayBuckets', `${chainId}`],
    {
      revalidate: 60 * 15,
    },
  )()

  return !dayBuckets.v2.length && !dayBuckets.v3.length ? (
    <GlobalStatsLoading />
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <TVLChart data={dayBuckets} />
      <VolumeChart data={dayBuckets} />
    </div>
  )
}

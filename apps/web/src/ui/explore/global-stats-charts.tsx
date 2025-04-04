import {
  type PoolChainId,
  getAnalyticsDayBuckets,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { type FC, Suspense } from 'react'
import { GlobalStatsLoading } from './global-stats-loading'
import { TVLChart } from './tvl-chart'
import { VolumeChart } from './volume-chart'

const getChartStartDate = (daysAgo: number): Date => {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() - daysAgo)
  return date
}

export const GlobalStatsCharts: FC<{ chainId: PoolChainId }> = ({
  chainId,
}) => {
  return (
    <Suspense fallback={<GlobalStatsLoading chainId={chainId} />}>
      <_GlobalStatsCharts chainId={chainId} />
    </Suspense>
  )
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

  const tvlStartDate = getChartStartDate(500)
  const volumeStartDate = getChartStartDate(30)

  return !dayBuckets.v2.length &&
    !dayBuckets.v3.length &&
    !dayBuckets.blade?.length ? (
    <GlobalStatsLoading chainId={chainId} />
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <TVLChart chainId={chainId} data={dayBuckets} startDate={tvlStartDate} />
      <VolumeChart
        chainId={chainId}
        data={dayBuckets}
        startDate={volumeStartDate}
      />
    </div>
  )
}

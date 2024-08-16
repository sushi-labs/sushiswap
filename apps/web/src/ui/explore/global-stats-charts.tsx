import { getAnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { FC } from 'react'
import { ChainId } from 'sushi/chain'
import { TVLChart } from './tvl-chart'
import { VolumeChart } from './volume-chart'

export const GlobalStatsCharts: FC<{ chainId: ChainId }> = async ({
  chainId,
}) => {
  const dayBuckets = await unstable_cache(
    async () =>
      getAnalyticsDayBuckets({
        chainId,
      }),
    ['dayBuckets', `${chainId}`],
    {
      revalidate: 60 * 3,
    },
  )()

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <TVLChart data={dayBuckets} />
        <VolumeChart data={dayBuckets} />
      </div>
    </div>
  )
}

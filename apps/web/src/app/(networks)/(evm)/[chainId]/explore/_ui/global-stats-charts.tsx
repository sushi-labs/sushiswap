import {
  getAnalyticsDayBuckets,
  isPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { isBladeChainId } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { type FC, Suspense } from 'react'
import type { EvmChainId } from 'sushi/evm'
import { GlobalStatsLoading } from './global-stats-loading'
import { TVLChart } from './tvl-chart'
import { VolumeChart } from './volume-chart'

export const GlobalStatsCharts: FC<{ chainId: EvmChainId }> = ({ chainId }) => {
  return (
    <Suspense fallback={<GlobalStatsLoading chainId={chainId} />}>
      <_GlobalStatsCharts chainId={chainId} />
    </Suspense>
  )
}

const _GlobalStatsCharts: FC<{ chainId: EvmChainId }> = async ({ chainId }) => {
  const dayBuckets = await unstable_cache(
    async () =>
      isPoolChainId(chainId)
        ? getAnalyticsDayBuckets({
            chainId,
          })
        : {
            v2: [],
            v3: [],
            blade: [],
          },
    ['dayBuckets', `${chainId}`],
    {
      revalidate: 60 * 15,
    },
  )()

  const isLoading =
    !dayBuckets.v2.length && !dayBuckets.v3.length && !dayBuckets.blade?.length

  const showBlade = isBladeChainId(chainId)

  return isLoading ? (
    <GlobalStatsLoading chainId={chainId} />
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <TVLChart chainId={chainId} data={dayBuckets} showBlade={showBlade} />
      <VolumeChart chainId={chainId} data={dayBuckets} showBlade={showBlade} />
    </div>
  )
}

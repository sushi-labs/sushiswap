'use client'
import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { type FC, Suspense } from 'react'
import { useAnalyticsDayBuckets } from 'src/lib/hooks/react-query'
import { type EvmChainId, isBladeChainId } from 'sushi/evm'
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

const _GlobalStatsCharts: FC<{ chainId: EvmChainId }> = ({ chainId }) => {
  const { data: dayBuckets, isLoading } = useAnalyticsDayBuckets({
    chainId,
    enabled: isPoolChainId(chainId),
  })

  const showBlade = isBladeChainId(chainId)

  if (isLoading || !dayBuckets) {
    return <GlobalStatsLoading chainId={chainId} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <TVLChart chainId={chainId} data={dayBuckets} showBlade={showBlade} />
      <VolumeChart chainId={chainId} data={dayBuckets} showBlade={showBlade} />
    </div>
  )
}

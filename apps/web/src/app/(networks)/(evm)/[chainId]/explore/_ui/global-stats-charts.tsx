'use client'
import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import ms from 'ms'
import { type FC, Suspense } from 'react'
import { useAnalyticsDayBuckets } from 'src/lib/hooks/react-query/explore/use-analytics-day-buckets'
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

export const TIMEFRAME_OPTIONS = ['1W', '1M', '3M', 'All'] as const

export type TimeframeOption = (typeof TIMEFRAME_OPTIONS)[number]

export const timeframeToMs: Record<TimeframeOption, number> = {
  '1W': ms('7d'),
  '1M': ms('30d'),
  '3M': ms('90d'),
  All: Number.MAX_SAFE_INTEGER,
}

const _GlobalStatsCharts: FC<{ chainId: EvmChainId }> = ({ chainId }) => {
  const { data: dayBuckets, isLoading } = useAnalyticsDayBuckets({
    chainId,
    enabled: isPoolChainId(chainId),
  })
  const isMounted = useIsMounted()

  if (isLoading || !dayBuckets || !isMounted) {
    return <GlobalStatsLoading chainId={chainId} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TVLChart chainId={chainId} data={dayBuckets} showBlade={false} />
      <VolumeChart chainId={chainId} data={dayBuckets} showBlade={false} />
    </div>
  )
}

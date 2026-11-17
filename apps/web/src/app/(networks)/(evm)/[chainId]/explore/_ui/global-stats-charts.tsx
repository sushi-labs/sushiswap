'use client'
import {
  type AnalyticsDayBuckets,
  isPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import ms from 'ms'
import { type FC, Suspense } from 'react'
import { useAnalyticsDayBuckets } from 'src/lib/hooks/react-query/explore/use-analytics-day-buckets'
import type { EvmChainId } from 'sushi/evm'
import { GlobalStatsChartsLayout } from './global-stats-chart-card'
import { GlobalStatsLoading } from './global-stats-loading'
import { useTVLChart } from './tvl-chart'
import { useVolumeChart } from './volume-chart'

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

  return <GlobalStatsChartsContent chainId={chainId} data={dayBuckets} />
}

function GlobalStatsChartsContent({
  chainId,
  data,
}: {
  chainId: EvmChainId
  data: AnalyticsDayBuckets
}): React.ReactElement {
  const tvl = useTVLChart({ chainId, data, showBlade: false })
  const volume = useVolumeChart({ chainId, data, showBlade: false })

  return (
    <GlobalStatsChartsLayout
      charts={[
        { value: 'tvl', ...tvl },
        { value: 'volume', ...volume },
      ]}
    />
  )
}

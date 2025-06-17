'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { useDexMetrics } from '~kadena/_common/lib/hooks/use-dex-metrics'
import { GlobalStatsLoading } from './GlobalStatsLoading'
import { TVLChart } from './TVLChart'
import { VolumeChart } from './VolumeChart'

export const GlobalStatsCharts = () => {
  const { data: dexMetrics, isLoading } = useDexMetrics()
  const isMounted = useIsMounted()

  if (isLoading || !isMounted) {
    return <GlobalStatsLoading />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <TVLChart data={dexMetrics} />
      <VolumeChart data={dexMetrics} />
    </div>
  )
}

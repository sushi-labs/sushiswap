import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import { SkeletonChart } from '../../_ui/skeleton-chart'
import {
  type GlobalStatsChartCardProps,
  GlobalStatsChartsLayout,
} from './global-stats-chart-card'

export { SkeletonChart }

function getLoadingChart({
  chainId,
  title,
  type,
}: {
  chainId: EvmChainId
  title: string
  type: 'area' | 'bar'
}): GlobalStatsChartCardProps {
  return {
    title,
    timeframe: type === 'area' ? 'All' : '1M',
    summary: (
      <span aria-busy="true" className="flex flex-col gap-1">
        <span className="w-28 h-9 rounded-lg bg-muted animate-pulse" />
        <span className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <span>{getEvmChainById(chainId).name} ·</span>
          <span className="w-24 h-4 rounded-lg bg-muted animate-pulse" />
        </span>
      </span>
    ),
    children: <SkeletonChart type={type} />,
  }
}

export function GlobalStatsLoading({
  chainId,
}: { chainId: EvmChainId }): React.ReactElement {
  return (
    <GlobalStatsChartsLayout
      charts={[
        {
          value: 'tvl',
          ...getLoadingChart({
            chainId,
            title: 'Total value locked',
            type: 'area',
          }),
        },
        {
          value: 'volume',
          ...getLoadingChart({ chainId, title: 'Trading volume', type: 'bar' }),
        },
      ]}
    />
  )
}

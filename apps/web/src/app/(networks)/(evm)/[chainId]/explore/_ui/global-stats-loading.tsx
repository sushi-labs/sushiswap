import {
  Card,
  CardContent,
  SkeletonBox,
  SkeletonChartLoadingStateMask,
  SkeletonChartXAxe,
  Toggle,
  ToggleGroup,
} from '@sushiswap/ui'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import { TIMEFRAME_OPTIONS } from './global-stats-charts'

export function SkeletonChart({
  type,
}: { type: 'area' | 'bar' }): React.ReactElement {
  const height = 200
  const top = 24

  return (
    <div className="relative flex flex-row">
      <svg
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <g transform={`translate(0, ${top})`}>
          <SkeletonChartLoadingStateMask
            type={type}
            height={height - top - 32}
          />
        </g>
        <SkeletonChartXAxe height={height - 16} />
      </svg>
    </div>
  )
}

function GlobalStatsChartLoading({
  chainId,
  title,
  type,
}: {
  chainId: EvmChainId
  title: string
  type: 'area' | 'bar'
}): React.ReactElement {
  return (
    <Card aria-busy="true" aria-label={`Loading ${title.toLowerCase()}`}>
      <CardContent className="pt-6 pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">{title}</span>
              <SkeletonBox className="w-36 h-9" />
              <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <span>{getEvmChainById(chainId).name} ·</span>
                <SkeletonBox className="w-24 h-4" />
              </div>
            </div>
            <ToggleGroup className="h-fit">
              {TIMEFRAME_OPTIONS.map((time) => (
                <Toggle key={time} pressed={time === 'All'} size="xs" disabled>
                  {time}
                </Toggle>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex gap-1 self-end" aria-hidden="true">
            <SkeletonBox className="w-8 h-4" />
            <SkeletonBox className="w-8 h-4" />
          </div>
        </div>
        <SkeletonChart type={type} />
      </CardContent>
    </Card>
  )
}

export function GlobalStatsLoading({
  chainId,
}: { chainId: EvmChainId }): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <GlobalStatsChartLoading
        chainId={chainId}
        title="Total value locked"
        type="area"
      />
      <GlobalStatsChartLoading chainId={chainId} title="Volume" type="bar" />
    </div>
  )
}

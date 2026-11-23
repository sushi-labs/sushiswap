import { SkeletonChartLoadingStateMask, SkeletonChartXAxe } from '@sushiswap/ui'

export function SkeletonChart({
  type,
  height = 200,
}: { type: 'area' | 'bar'; height?: number }): React.ReactElement {
  const top = 24

  return (
    <div className="relative flex flex-row">
      <svg
        aria-hidden="true"
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

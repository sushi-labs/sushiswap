import { scaleLinear, scaleTime } from 'd3'
import { useId, useMemo } from 'react'
import { Sparkline } from 'src/ui/pool/add-liquidity/active-liquidity-chart/svg'
import { HorizontalLine } from './price-range-sparkline-clmm'

const sparklineData = new Array(100).fill(0).map((_, i) => ({
  price: Math.random() * 100,
  timestamp: Date.now() - i * 1000 * 60, // Simulating data for the last 100 minutes
}))

export const PriceRangeSparklineAmm = () => {
  const id = useId()

  const width = 452 + 64 // Example width
  const height = 124 // Example height

  const min = sparklineData.reduce((min, d) => Math.min(min, d.price), 0)
  const max = sparklineData.reduce((max, d) => Math.max(max, d.price), 0)

  const current = sparklineData[sparklineData.length - 1].price

  const { yScale } = useMemo(() => {
    const scales = {
      yScale: scaleLinear()
        .domain([min, max] as number[])
        .range([height, 0]),
    }

    return scales
  }, [min, max])

  const sparkLineXScale = useMemo(() => {
    return scaleTime()
      .domain([
        new Date(sparklineData[0].timestamp),
        new Date(sparklineData[sparklineData.length - 1].timestamp),
      ])
      .range([0, width])
  }, [])

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <clipPath id={`${id}-chart-clip`}>
          <rect x="0" y="0" width={width} height={height} />
        </clipPath>
      </defs>

      <g>
        <Sparkline
          data={sparklineData}
          xScale={sparkLineXScale}
          height={height}
        />
        <g clipPath={`url(#${id}-chart-clip)`}>
          <HorizontalLine
            value={current}
            yScale={yScale}
            width={width + 12}
            containerWidth={width}
            lineStyle="dashed"
            linePlacement="center"
          />
        </g>
      </g>
    </svg>
  )
}

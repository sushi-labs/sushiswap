import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { classNames } from '@sushiswap/ui'
import { max as getMax, scaleLinear, scaleTime } from 'd3'
import type { ScaleLinear } from 'd3'
import ms from 'ms'
import { useTheme } from 'next-themes'
import { useId, useMemo } from 'react'
import { Sparkline } from 'src/ui/pool/add-liquidity/active-liquidity-chart/svg'
import type { ChartEntry } from 'src/ui/pool/add-liquidity/active-liquidity-chart/types'

const xAccessor = (d: ChartEntry) => d.activeLiquidity
// const yAccessor = (d: ChartEntry) => d.price0;

const sparklineData = new Array(100).fill(0).map((_, i) => ({
  price: Math.random() * 100,
  timestamp: Date.now() - i * ms('1m'),
}))

const series = new Array(100).fill(0).map((_) => ({
  activeLiquidity: Math.random() * 1000,
  price0: Math.random() * 100,
}))

export const PriceRangeSparklineCLMM = ({
  strokeWidth,
}: { strokeWidth?: number }) => {
  const id = useId()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const width = 452 + 64 // Example width
  const height = 124 // Example height

  const min = sparklineData.reduce((min, d) => Math.min(min, d.price), 0)
  const max = sparklineData.reduce((max, d) => Math.max(max, d.price), 0)

  const current = (min + max) / 2

  const brushDomain: [number, number] = [min + 20, max - 20] // Example brush domain

  const { yScale } = useMemo(() => {
    const activeEntries =
      min && max
        ? series.filter((d) => d.price0 >= min && d.price0 <= max)
        : series

    const scales = {
      yScale: scaleLinear()
        .domain([min, max] as number[])
        .range([height, 0]),
      xScale: scaleLinear()
        .domain([0, getMax(activeEntries, xAccessor)] as number[])
        .range([width, width]),
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
  const yA = yScale(brushDomain[0]) // bottom line
  const yB = yScale(brushDomain[1]) // top line
  const y = Math.min(yA, yB)
  const h = Math.abs(yA - yB)

  const priceOutOfRange = current < brushDomain[0] || current > brushDomain[1]

  return (
    <div className="relative">
      {priceOutOfRange && (
        <div className="absolute top-0 left-0 w-full h-full gap-2 px-2 flex items-center justify-center text-red-100 text-xs">
          <ExclamationTriangleIcon width={20} height={20} />
          <span className="font-medium">
            Current Price is {current < brushDomain[0] ? 'below' : 'above'} your
            position price range.
          </span>
        </div>
      )}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className={classNames(priceOutOfRange ? 'grayscale opacity-40' : '')}
      >
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={width} height={height} />
          </clipPath>
          <style>
            {`
            .axis-right line { display: none; }
            .axis-right text { fill: ${isDarkMode ? '#ffffff8C' : '#0000008C'}; }
          `}
          </style>
        </defs>

        <g>
          <Sparkline
            data={sparklineData}
            xScale={sparkLineXScale}
            height={height}
          />
          <g clipPath={`url(#${id}-chart-clip)`}>
            <rect
              x={0} // full width
              y={y}
              width={width}
              height={h}
              fill="#3DB1FF14"
              pointerEvents="none"
            />

            <HorizontalLine
              value={brushDomain[1]}
              yScale={yScale}
              width={width + 12}
              containerWidth={width}
              lineStyle="solid"
              linePlacement="top"
              strokeWidth={strokeWidth}
            />
            <HorizontalLine
              value={current}
              yScale={yScale}
              width={width + 12}
              containerWidth={width}
              lineStyle="dashed"
              linePlacement="center"
              strokeWidth={strokeWidth}
            />
            <HorizontalLine
              value={brushDomain[0]}
              yScale={yScale}
              width={width + 12}
              containerWidth={width}
              lineStyle="solid"
              linePlacement="bottom"
              strokeWidth={strokeWidth}
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

export const HorizontalLine = ({
  value,
  yScale,
  width,
  containerWidth,
  lineStyle = 'dashed',
  linePlacement,
  strokeWidth = 3,
}: {
  value: number
  yScale: ScaleLinear<number, number>
  width: number
  containerWidth: number
  lineStyle: 'solid' | 'dashed'
  linePlacement: 'top' | 'bottom' | 'center'
  strokeWidth?: number
}) => {
  const lineStart = containerWidth - width

  if (Number.isNaN(lineStart)) {
    return null
  }

  const strokeDasharray =
    lineStyle === 'dashed' ? (strokeWidth * 1.5).toString() : 'none'

  return (
    <line
      strokeDasharray={strokeDasharray}
      stroke={
        lineStyle === 'dashed'
          ? '#1DA67D'
          : lineStyle === 'solid' && linePlacement === 'top'
            ? '#3DB1FF'
            : lineStyle === 'solid' && linePlacement === 'bottom'
              ? '#F338C3'
              : 'red'
      }
      opacity={1}
      strokeWidth={strokeWidth}
      fill="none"
      y1={yScale(value)}
      x1={lineStart}
      y2={yScale(value)}
      x2={lineStart + width}
    />
  )
}

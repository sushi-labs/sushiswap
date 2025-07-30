import { AxisRight } from './axis-right'
import { Brush } from './brush'
import { HorizontalArea } from './horizontal-area'
import { HorizontalLine } from './horizontal-line'

import { Button } from '@sushiswap/ui'
import { max as getMax, scaleLinear, scaleTime } from 'd3'
import { useTheme } from 'next-themes'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { AxisBottomTime } from './axis-bottom-time'
import { Sparkline } from './svg'
import type { ChartEntry } from './types'

const xAccessor = (d: ChartEntry) => d.activeLiquidity
const yAccessor = (d: ChartEntry) => d.price0

const priceDataCache = new Map<string, ChartEntry>()

const TIME_OPTIONS = [
  {
    label: '1d',
    value: '1d',
    data: new Array(12).fill(null).map((_, idx) => ({
      timestamp: Date.now() + idx * 3600 * 1000,
      price: Math.random() * 1000 + idx * 10,
    })),
  },
  {
    label: '7d',
    value: '7d',
    data: new Array(24).fill(null).map((_, idx) => ({
      timestamp: Date.now() + idx * 3600 * 1000,
      price: Math.random() * 1000 + idx * 10,
    })),
  },
  {
    label: '30d',
    value: '30d',
    data: new Array(24 * 2).fill(null).map((_, idx) => ({
      timestamp: Date.now() + idx * 3600 * 1000,
      price: Math.random() * 1000 + idx * 10,
    })),
  },
  {
    label: 'All',
    value: 'all',
    data: new Array(24 * 5).fill(null).map((_, idx) => ({
      timestamp: Date.now() + idx * 3600 * 1000,
      price: Math.random() * 1000 + idx * 10,
    })),
  },
] as const

function findClosestElementBinarySearch(data: ChartEntry[], target?: number) {
  let left = 0
  let right = data.length - 1

  if (!target) {
    return null
  }

  if (priceDataCache.has(target.toString())) {
    return priceDataCache.get(target.toString())
  }

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (data[mid].price0 === target) {
      priceDataCache.set(target.toString(), data[mid])
      return data[mid]
    } else if (data[mid].price0 < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  // After binary search, left and right are the closest bounds
  const closest = data[right] ?? { price0: Number.POSITIVE_INFINITY } // Handle bounds
  const nextClosest = data[left] ?? { price0: Number.POSITIVE_INFINITY }

  // Return the element with the closest `price0`
  const closestElement =
    Math.abs(closest.price0 - target) <= Math.abs(nextClosest.price0 - target)
      ? closest
      : nextClosest

  priceDataCache.set(target.toString(), closestElement)
  return closestElement
}

// function scaleToInteger(a: number, precision = 18) {
//   const scaleFactor = Math.pow(10, precision)
//   return Math.round(a * scaleFactor)
// }

/**
 * A horizontal version of the active liquidity area chart, which uses the
 * x-y coordinate plane to show the data, but with the axes flipped so lower
 * prices are at the bottom of the chart, and liquidity bars grow from the right end of the chart.
 *   - Bars grow (to the left) along the X axis to represent the active liquidity at a given price.
 *   - Bars are placed along the Y axis to represent price (i.e. bottom of chart is y=0 or the min price).
 */
export function ActiveLiquidityChart({
  id = 'ActiveLiquidityChart2',
  data: { series, current, min, max },
  dimensions: { width, height, contentWidth, axisLabelPaneWidth },
  brushDomain,
  onBrushDomainChange,
  disableBrush,
  disableRightAxis,
  disableBrushInteraction,
  tokenToggle,
}: {
  id?: string
  data: {
    series: ChartEntry[]
    current: number
    min?: number
    max?: number
  }
  disableBrush?: boolean
  disableRightAxis?: boolean
  disableBrushInteraction?: boolean
  dimensions: {
    width: number
    height: number
    contentWidth: number
    axisLabelPaneWidth: number
  }
  brushDomain?: [number, number]
  onBrushDomainChange: (
    domain: [number, number],
    mode: string | undefined,
  ) => void
  tokenToggle?: ReactNode
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoverY, setHoverY] = useState<number>()
  const [_showDiffIndicators, setShowDiffIndicators] = useState(false)
  const [timeSelector, setTimeSelector] =
    useState<(typeof TIME_OPTIONS)[number]['value']>('1d')

  const { xScale, yScale } = useMemo(() => {
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
        .range([
          width - axisLabelPaneWidth,
          width - axisLabelPaneWidth - contentWidth,
        ]),
    }

    return scales
  }, [min, max, series, height, width, axisLabelPaneWidth, contentWidth])

  const hoveredTick = useMemo(() => {
    if (!hoverY) {
      return undefined
    }
    const price = yScale.invert(hoverY)
    return findClosestElementBinarySearch(series, price)
  }, [hoverY, series, yScale])

  const _currentTick = useMemo(() => {
    return findClosestElementBinarySearch(series, current)?.tick
  }, [current, series])

  useEffect(() => {
    if (!brushDomain) {
      const [min, max] = yScale.domain()
      const lowerBound = min + (max - min) * 0.2
      const upperBound = min + (max - min) * 0.8
      onBrushDomainChange([lowerBound, upperBound], undefined)
    }
  }, [brushDomain, onBrushDomainChange, yScale])

  // const southHandleInView = brushDomain && yScale(brushDomain[0]) >= 0 && yScale(brushDomain[0]) <= height;
  // const northHandleInView = brushDomain && yScale(brushDomain[1]) >= 0 && yScale(brushDomain[1]) <= height;

  const sparklineData = useMemo(() => {
    return (
      TIME_OPTIONS.find((option) => option.value === timeSelector)?.data ?? []
    )
  }, [timeSelector])

  const sparkLineXScale = useMemo(() => {
    return scaleTime()
      .domain([
        new Date(sparklineData[0].timestamp),
        new Date(sparklineData[sparklineData.length - 1].timestamp),
      ])
      .range([0, width * 0.875])
  }, [sparklineData, width])
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="relative flex flex-col gap-4 md:bg-transparent dark:md:bg-transparent bg-gray-100 dark:bg-slate-900 p-1.5 rounded-lg">
      <div className="flex flex-col items-end md:items-center gap-4 md:flex-row justify-between w-full">
        {tokenToggle}
        <div className="flex items-center gap-2 mr-12 md:mr-0">
          {TIME_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={timeSelector === option.value ? 'tertiary' : 'ghost'}
              size="xs"
              className="!px-2 !py-0.5"
              onClick={() => setTimeSelector(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* {showDiffIndicators && (
				<>
					{southHandleInView && (
						<div
							className="rounded-lg bg-gray-100 dark:bg-slate-900 p-2 absolute left-0"
							style={{
								top: yScale(brushDomain[0]) + 100,
							}}>
							<p className="text-xs">
								{formatPercent(
									new Percent(scaleToInteger(brushDomain[0] - current), scaleToInteger(current))
										.divide(100)
										.toSignificant()
								)}
							</p>
						</div>
					)}
					{northHandleInView && (
						<div
							className="rounded-lg bg-gray-100 dark:bg-slate-900 p-2 absolute left-0"
							style={{
								top: yScale(brushDomain[1]) + 50,
							}}>
							<p className="text-xs">
								{formatPercent(
									new Percent(scaleToInteger(brushDomain[1] - current), scaleToInteger(current))
										.divide(100)
										.toSignificant()
								)}
							</p>
						</div>
					)}
				</>
			)} */}
      <svg
        ref={svgRef}
        width="106%"
        height="100%"
        viewBox={`0 0 ${width} ${height + 30}`}
        onMouseMove={(event) => {
          if (!svgRef.current) {
            return
          }
          const rect = svgRef.current.getBoundingClientRect()
          const y = event.clientY - rect.top
          const x = event.clientX - rect.left
          if (x > width - axisLabelPaneWidth - contentWidth) {
            setHoverY(y)
          } else {
            setHoverY(undefined)
          }
        }}
        onMouseEnter={() => {
          setShowDiffIndicators(true)
        }}
        onMouseLeave={() => {
          setHoverY(undefined)
          setShowDiffIndicators(false)
        }}
      >
        <defs>
          <clipPath id={`${id}-chart-clip`}>
            <rect x="0" y="0" width={width} height={height} />
          </clipPath>

          {brushDomain && !disableBrush && (
            // mask to highlight selected area
            <mask id={`${id}-chart-area-mask`}>
              <rect
                fill="white"
                y={yScale(brushDomain[1])}
                x={width - axisLabelPaneWidth - contentWidth - 1}
                height={yScale(brushDomain[0]) - yScale(brushDomain[1])}
                width={contentWidth + 2}
              />
            </mask>
          )}

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
          <AxisBottomTime xScale={sparkLineXScale} innerHeight={height} />
          <g clipPath={`url(#${id}-chart-clip)`}>
            <HorizontalArea
              series={series}
              xScale={xScale}
              yScale={yScale}
              xValue={xAccessor}
              yValue={yAccessor}
              brushDomain={brushDomain}
              containerHeight={height}
              fill={isDarkMode ? '#ffffff1F' : '#0000001F'}
              selectedFill={isDarkMode ? '#ffffff1F' : '#0000001F'}
              containerWidth={width - axisLabelPaneWidth}
            />

            {!disableBrush && (
              <HorizontalLine
                value={current}
                yScale={yScale}
                width={contentWidth + 12}
                containerWidth={width - axisLabelPaneWidth}
              />
            )}

            {hoverY &&
              hoveredTick &&
              Number(hoveredTick.amount0Locked) +
                Number(hoveredTick.amount1Locked) >
                0 && (
                <HorizontalLine
                  value={yScale.invert(hoverY)}
                  yScale={yScale}
                  width={contentWidth + 12}
                  containerWidth={width - axisLabelPaneWidth}
                  lineStyle="solid"
                />
              )}
          </g>

          {disableRightAxis ? null : (
            <AxisRight
              yScale={yScale}
              offset={width - axisLabelPaneWidth}
              min={brushDomain?.[0]}
              current={current}
              max={brushDomain?.[1]}
              height={height}
            />
          )}

          {!disableBrush && (
            <Brush
              id={id}
              yScale={yScale}
              interactive={!disableBrushInteraction}
              brushExtent={brushDomain ?? (yScale.domain() as [number, number])}
              hideHandles={!brushDomain}
              width={width - axisLabelPaneWidth}
              height={height}
              setBrushExtent={onBrushDomainChange}
            />
          )}
        </g>
      </svg>
    </div>
  )
}

'use client'

import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from '@heroicons/react/20/solid'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui'
import { area, curveStepAfter, max, scaleLinear } from 'd3'
import React, {
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ChartEntry } from '~evm/[chainId]/_ui/LiquidityChartRangeInput/types'

const DEFAULT_CHART_WIDTH = 600
const DEFAULT_CHART_HEIGHT = 380
const MARGIN = { top: 26, right: 16, bottom: 38, left: 16 }
const SELL_COLOR = '#22c55e'
const BUY_COLOR = '#ef4444'

export interface DepthPoint {
  logicalIndex: number
  price: number
  depth: number
  side: 'sell' | 'buy'
}

export interface PoolDepthData {
  sell: DepthPoint[]
  buy: DepthPoint[]
}

const SPARSE_POOL_MAX_STEPS = 8

export function getInitialVisibleSteps(maxSteps: number): number {
  if (maxSteps <= SPARSE_POOL_MAX_STEPS) return maxSteps
  return Math.max(1, Math.ceil(maxSteps * 0.4))
}

export function getNextVisibleSteps({
  visibleSteps,
  maxSteps,
  direction,
}: {
  visibleSteps: number
  maxSteps: number
  direction: 'in' | 'out'
}): number {
  if (direction === 'in') {
    return Math.max(
      1,
      Math.min(visibleSteps - 1, Math.floor(visibleSteps / 1.5)),
    )
  }

  return Math.min(
    maxSteps,
    Math.max(visibleSteps + 1, Math.ceil(visibleSteps * 1.5)),
  )
}

function getBaseTokenDepth({
  liquidity,
  lowerPrice,
  upperPrice,
  token0Decimals,
  token1Decimals,
}: {
  liquidity: number
  lowerPrice: number
  upperPrice: number
  token0Decimals: number
  token1Decimals: number
}): number {
  if (
    liquidity <= 0 ||
    lowerPrice <= 0 ||
    upperPrice <= lowerPrice ||
    !Number.isFinite(liquidity)
  ) {
    return 0
  }

  const decimalScale = 10 ** (token0Decimals - token1Decimals)
  const lowerSqrtPrice = Math.sqrt(lowerPrice / decimalScale)
  const upperSqrtPrice = Math.sqrt(upperPrice / decimalScale)
  const rawAmount =
    liquidity * Math.abs(1 / lowerSqrtPrice - 1 / upperSqrtPrice)

  return rawAmount / 10 ** token0Decimals
}

export function buildPoolDepthData({
  series,
  currentPrice,
  token0Decimals,
  token1Decimals,
}: {
  series: ChartEntry[]
  currentPrice: number
  token0Decimals: number
  token1Decimals: number
}): PoolDepthData {
  const sorted = series
    .filter(
      ({ activeLiquidity, price0 }) =>
        activeLiquidity >= 0 &&
        price0 > 0 &&
        Number.isFinite(activeLiquidity) &&
        Number.isFinite(price0),
    )
    .toSorted((a, b) => a.price0 - b.price0)

  let activeIndex = -1
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].price0 <= currentPrice) activeIndex = i
  }

  if (activeIndex < 0 || activeIndex >= sorted.length) {
    return { sell: [], buy: [] }
  }

  const sellSteps: Omit<DepthPoint, 'logicalIndex'>[] = []
  let cumulativeSellDepth = 0
  for (let i = activeIndex; i >= 0; i--) {
    const lowerPrice = sorted[i].price0
    const upperPrice = i === activeIndex ? currentPrice : sorted[i + 1].price0
    if (lowerPrice >= upperPrice) continue

    cumulativeSellDepth += getBaseTokenDepth({
      liquidity: sorted[i].activeLiquidity,
      lowerPrice,
      upperPrice,
      token0Decimals,
      token1Decimals,
    })

    if (cumulativeSellDepth > 0) {
      sellSteps.unshift({
        price: lowerPrice,
        depth: cumulativeSellDepth,
        side: 'sell',
      })
    }
  }

  const sell = sellSteps.map((point, index) => ({
    ...point,
    logicalIndex: index - sellSteps.length,
  }))
  sell.push({
    logicalIndex: 0,
    price: currentPrice,
    depth: 0,
    side: 'sell',
  })

  const buy: DepthPoint[] = [
    {
      logicalIndex: 0,
      price: currentPrice,
      depth: 0,
      side: 'buy',
    },
  ]
  let cumulativeBuyDepth = 0
  for (let i = activeIndex; i < sorted.length - 1; i++) {
    const lowerPrice = Math.max(currentPrice, sorted[i].price0)
    const upperPrice = sorted[i + 1].price0
    if (lowerPrice >= upperPrice) continue

    cumulativeBuyDepth += getBaseTokenDepth({
      liquidity: sorted[i].activeLiquidity,
      lowerPrice,
      upperPrice,
      token0Decimals,
      token1Decimals,
    })

    if (cumulativeBuyDepth > 0) {
      buy.push({
        logicalIndex: buy.length,
        price: upperPrice,
        depth: cumulativeBuyDepth,
        side: 'buy',
      })
    }
  }

  return { sell, buy }
}

function formatNumber(value: number): string {
  const absoluteValue = Math.abs(value)
  if (absoluteValue >= 1_000) {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value)
  }
  if (absoluteValue >= 1) {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: 4,
    }).format(value)
  }
  if (absoluteValue >= 0.001) {
    return new Intl.NumberFormat('en', {
      maximumFractionDigits: 6,
    }).format(value)
  }
  return value === 0 ? '0' : value.toExponential(2)
}

function getAxisPoints(sell: DepthPoint[], buy: DepthPoint[]): DepthPoint[] {
  const candidates = [
    sell[0],
    sell[Math.floor((sell.length - 1) / 2)],
    sell.at(-1),
    buy[Math.floor((buy.length - 1) / 2)],
    buy.at(-1),
  ].filter((point): point is DepthPoint => Boolean(point))

  return candidates.filter(
    (point, index) =>
      candidates.findIndex(
        (candidate) => candidate.logicalIndex === point.logicalIndex,
      ) === index,
  )
}

interface DepthChartProps {
  series: ChartEntry[]
  currentPrice: number
  baseSymbol: string
  quoteSymbol: string
  token0Decimals: number
  token1Decimals: number
}

export function DepthChart({
  series,
  currentPrice,
  baseSymbol,
  quoteSymbol,
  token0Decimals,
  token1Decimals,
}: DepthChartProps) {
  const id = useId().replaceAll(':', '')
  const containerRef = useRef<HTMLDivElement>(null)
  const [{ width: chartWidth, height: chartHeight }, setChartSize] = useState({
    width: DEFAULT_CHART_WIDTH,
    height: DEFAULT_CHART_HEIGHT,
  })
  const innerWidth = Math.max(1, chartWidth - MARGIN.left - MARGIN.right)
  const innerHeight = Math.max(1, chartHeight - MARGIN.top - MARGIN.bottom)
  const data = useMemo(
    () =>
      buildPoolDepthData({
        series,
        currentPrice,
        token0Decimals,
        token1Decimals,
      }),
    [currentPrice, series, token0Decimals, token1Decimals],
  )
  const maxSteps = Math.max(data.sell.length - 1, data.buy.length - 1, 1)
  const initialVisibleSteps = getInitialVisibleSteps(maxSteps)
  const [visibleSteps, setVisibleSteps] = useState(initialVisibleSteps)
  const [hoveredPoint, setHoveredPoint] = useState<DepthPoint | null>(null)

  useEffect(() => {
    setVisibleSteps(initialVisibleSteps)
  }, [initialVisibleSteps])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setChartSize({ width, height })
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const visibleData = useMemo(
    () => ({
      sell: data.sell.filter(
        ({ logicalIndex }) => Math.abs(logicalIndex) <= visibleSteps,
      ),
      buy: data.buy.filter(
        ({ logicalIndex }) => Math.abs(logicalIndex) <= visibleSteps,
      ),
    }),
    [data, visibleSteps],
  )

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([-visibleSteps - 0.5, visibleSteps + 0.5])
        .range([0, innerWidth]),
    [innerWidth, visibleSteps],
  )
  const maxDepth =
    max([...visibleData.sell, ...visibleData.buy], ({ depth }) => depth) ?? 0
  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxDepth > 0 ? maxDepth * 1.08 : 1])
        .range([innerHeight, 0])
        .nice(),
    [innerHeight, maxDepth],
  )

  const createArea = useCallback(
    (points: DepthPoint[]) =>
      area<DepthPoint>()
        .curve(curveStepAfter)
        .x(({ logicalIndex }) => xScale(logicalIndex))
        .y0(innerHeight)
        .y1(({ depth }) => yScale(depth))(points) ?? undefined,
    [innerHeight, xScale, yScale],
  )
  const renderData = useMemo(() => {
    const leftEdge = -visibleSteps - 0.5
    const rightEdge = visibleSteps + 0.5
    const firstSell = visibleData.sell[0]
    const lastBuy = visibleData.buy.at(-1)

    return {
      sell:
        firstSell && firstSell.logicalIndex > leftEdge
          ? [{ ...firstSell, logicalIndex: leftEdge }, ...visibleData.sell]
          : visibleData.sell,
      buy:
        lastBuy && lastBuy.logicalIndex < rightEdge
          ? [...visibleData.buy, { ...lastBuy, logicalIndex: rightEdge }]
          : visibleData.buy,
    }
  }, [visibleData, visibleSteps])
  const sellPath = createArea(renderData.sell)
  const buyPath = createArea(renderData.buy)
  const axisPoints = getAxisPoints(visibleData.sell, visibleData.buy)
  const interactivePoints = [...visibleData.sell, ...visibleData.buy].filter(
    ({ logicalIndex }) => logicalIndex !== 0,
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<SVGSVGElement>) => {
      if (interactivePoints.length === 0) return
      const bounds = event.currentTarget.getBoundingClientRect()
      const chartX =
        ((event.clientX - bounds.left) / bounds.width) * chartWidth -
        MARGIN.left
      const logicalIndex = xScale.invert(chartX)
      const nearest = interactivePoints.reduce((closest, point) =>
        Math.abs(point.logicalIndex - logicalIndex) <
        Math.abs(closest.logicalIndex - logicalIndex)
          ? point
          : closest,
      )
      setHoveredPoint(nearest)
    },
    [chartWidth, interactivePoints, xScale],
  )

  const hoverX = hoveredPoint ? xScale(hoveredPoint.logicalIndex) : null
  const hoverY = hoveredPoint ? yScale(hoveredPoint.depth) : null
  const rangePercent = hoveredPoint
    ? ((hoveredPoint.price - currentPrice) / currentPrice) * 100
    : 0
  const tooltipLeft = hoverX ? ((hoverX + MARGIN.left) / chartWidth) * 100 : 50

  if (data.sell.length <= 1 && data.buy.length <= 1) {
    return (
      <div className="flex h-[380px] items-center justify-center text-sm text-muted-foreground">
        Liquidity depth is unavailable for this pool.
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full overflow-hidden"
    >
      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          aria-label="Zoom in"
          disabled={visibleSteps <= 1}
          onClick={() =>
            setVisibleSteps((steps) =>
              getNextVisibleSteps({
                visibleSteps: steps,
                maxSteps,
                direction: 'in',
              }),
            )
          }
        >
          <MagnifyingGlassPlusIcon width={18} height={18} />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label="Zoom out"
          disabled={visibleSteps >= maxSteps}
          onClick={() =>
            setVisibleSteps((steps) =>
              getNextVisibleSteps({
                visibleSteps: steps,
                maxSteps,
                direction: 'out',
              }),
            )
          }
        >
          <MagnifyingGlassMinusIcon width={18} height={18} />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label="Reset zoom"
          disabled={visibleSteps === initialVisibleSteps}
          onClick={() => setVisibleSteps(initialVisibleSteps)}
        >
          <ArrowPathIcon width={18} height={18} />
        </Button>
      </div>

      <svg
        role="img"
        aria-label={`${baseSymbol} and ${quoteSymbol} liquidity depth`}
        className="h-full w-full touch-none select-none"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredPoint(null)}
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect width={innerWidth} height={innerHeight} />
          </clipPath>
          <linearGradient id={`${id}-sell`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={SELL_COLOR} stopOpacity="0.42" />
            <stop offset="100%" stopColor={SELL_COLOR} stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={`${id}-buy`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={BUY_COLOR} stopOpacity="0.42" />
            <stop offset="100%" stopColor={BUY_COLOR} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          <g clipPath={`url(#${id}-clip)`}>
            <path
              d={sellPath}
              fill={`url(#${id}-sell)`}
              stroke={SELL_COLOR}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d={buyPath}
              fill={`url(#${id}-buy)`}
              stroke={BUY_COLOR}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <line
              x1={xScale(0)}
              x2={xScale(0)}
              y1={0}
              y2={innerHeight}
              stroke="currentColor"
              strokeDasharray="4 5"
              className="text-slate-500"
            />
            {hoverX !== null && hoverY !== null ? (
              <>
                <line
                  x1={hoverX}
                  x2={hoverX}
                  y1={0}
                  y2={innerHeight}
                  stroke="currentColor"
                  strokeDasharray="3 4"
                  className="text-slate-400"
                />
                <circle
                  cx={hoverX}
                  cy={hoverY}
                  r="4"
                  fill={hoveredPoint?.side === 'sell' ? SELL_COLOR : BUY_COLOR}
                  stroke="white"
                  strokeWidth="2"
                />
              </>
            ) : null}
          </g>

          <line
            x1={0}
            x2={innerWidth}
            y1={innerHeight}
            y2={innerHeight}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-700"
          />
          {axisPoints.map((point) => (
            <text
              key={`${point.side}-${point.logicalIndex}`}
              x={xScale(point.logicalIndex)}
              y={innerHeight + 24}
              textAnchor="middle"
              className="fill-slate-400 text-[10px]"
            >
              {formatNumber(point.price)}
            </text>
          ))}
        </g>
      </svg>

      {hoveredPoint ? (
        <div
          className="pointer-events-none absolute z-20 min-w-44 rounded-xl border border-accent bg-background/95 p-3 text-xs shadow-xl backdrop-blur"
          style={{
            left: `${tooltipLeft}%`,
            top: 56,
            transform:
              tooltipLeft > 70 ? 'translateX(-100%)' : 'translateX(8px)',
          }}
        >
          <div className="mb-2 flex items-center gap-2 font-medium">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  hoveredPoint.side === 'sell' ? SELL_COLOR : BUY_COLOR,
              }}
            />
            {hoveredPoint.side === 'sell' ? 'Sell depth' : 'Buy depth'}
          </div>
          <div className="space-y-1.5 text-muted-foreground">
            <div className="flex justify-between gap-6">
              <span>Range</span>
              <span className="font-medium text-foreground">
                {rangePercent >= 0 ? '+' : ''}
                {rangePercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Price</span>
              <span className="font-medium text-foreground">
                {formatNumber(hoveredPoint.price)} {quoteSymbol}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Depth</span>
              <span className="font-medium text-foreground">
                {formatNumber(hoveredPoint.depth)} {baseSymbol}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

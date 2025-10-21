import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { SkeletonBox, classNames } from '@sushiswap/ui'
import { max as getMax, scaleLinear, scaleTime } from 'd3'
import type { ScaleLinear } from 'd3'
import { useTheme } from 'next-themes'
import { useId, useMemo } from 'react'
import { usePoolBuckets } from 'src/lib/hooks/api/use-pool-buckets'
import type { Price } from 'sushi'
import type {
  EvmAddress,
  EvmToken,
  SushiSwapProtocol,
  SushiSwapV3ChainId,
} from 'sushi/evm'
import { Sparkline } from '~evm/[chainId]/_ui/add-liquidity/active-liquidity-chart/svg'
import type { ChartEntry } from '~evm/[chainId]/_ui/add-liquidity/active-liquidity-chart/types'

const xAccessor = (d: ChartEntry) => d.price0

export const PriceRangeSparklineCLMM = ({
  poolAddress,
  chainId,
  protocol,
  invert,
  strokeWidth,
  priceLower,
  priceUpper,
  outOfRange,
  range,
  isLoading,
}: {
  strokeWidth: number
  poolAddress: EvmAddress
  chainId: SushiSwapV3ChainId
  protocol: SushiSwapProtocol
  priceLower: Price<EvmToken, EvmToken> | undefined
  priceUpper: Price<EvmToken, EvmToken> | undefined
  invert: boolean
  outOfRange: boolean
  range: 'above' | 'below' | 'in-range' | 'unknown'
  isLoading: boolean
}) => {
  const id = useId()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const width = 452 + 64 // Example width
  const height = 124 // Example height
  const { data: bucketData, isLoading: isLoadingBucketData } = usePoolBuckets({
    chainId: chainId as SushiSwapV3ChainId,
    poolAddress: poolAddress as EvmAddress,
    protocol: protocol as SushiSwapProtocol,
    enabled: Boolean(chainId && poolAddress && protocol),
  })
  const sparklineData = useMemo(() => {
    if (!bucketData?.dayBuckets) return []
    return bucketData.dayBuckets
      .map((bucket) => ({
        price: invert ? bucket?.token1Price : bucket.token0Price,
        timestamp: bucket.date,
        activeLiquidity: bucket.liquidityUSD,
        price0: invert ? bucket.token1Price : bucket.token0Price,
        price1: invert ? bucket.token0Price : bucket.token1Price,
        tick: 0,
        amount0Locked: 0,
        amount1Locked: 0,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [bucketData, invert])

  const recordedPriceMin = useMemo(
    () =>
      sparklineData?.reduce(
        (min, d) => Math.min(min, d?.price),
        sparklineData?.[0]?.price,
      ),
    [sparklineData],
  )

  const recordedPriceMax = useMemo(
    () =>
      sparklineData?.reduce(
        (max, d) => Math.max(max, d?.price),
        sparklineData?.[0]?.price,
      ),
    [sparklineData],
  )

  const minPrice = priceLower?.toNumber() ?? 0
  const maxPrice = priceUpper?.toNumber() ?? 0

  const current = useMemo(
    () => sparklineData?.[sparklineData.length - 1]?.price,
    [sparklineData],
  )

  const brushDomain: [number, number] = useMemo(
    () => [
      recordedPriceMin > minPrice ? recordedPriceMin : minPrice,
      recordedPriceMax < maxPrice ? recordedPriceMax : maxPrice,
    ],
    [minPrice, maxPrice, recordedPriceMax, recordedPriceMin],
  )

  const { yScale } = useMemo(() => {
    const activeEntries =
      minPrice && maxPrice
        ? sparklineData?.filter(
            (d) => d.price >= minPrice && d.price <= maxPrice,
          )
        : sparklineData

    const scales = {
      yScale: scaleLinear()
        .domain([recordedPriceMin, recordedPriceMax] as number[])
        .range([height, 0]),
      xScale: scaleLinear()
        .domain([0, getMax(activeEntries, xAccessor)] as number[])
        .range([width, width]),
    }

    return scales
  }, [recordedPriceMin, recordedPriceMax, sparklineData, minPrice, maxPrice])

  const sparkLineXScale = useMemo(() => {
    return scaleTime()
      .domain([
        new Date(sparklineData?.[0]?.timestamp),
        new Date(sparklineData?.[sparklineData?.length - 1]?.timestamp),
      ])
      .range([0, width])
  }, [sparklineData])

  const yA = yScale(brushDomain[0]) // bottom line
  const yB = yScale(brushDomain[1]) // top line
  const y = Math.min(yA, yB)
  const h = Math.abs(yA - yB)

  return (
    <div className="relative">
      {outOfRange && (
        <div className="absolute top-0 left-0 w-full h-full gap-2 px-2 flex items-center justify-center text-red-100 text-xs">
          <ExclamationTriangleIcon width={20} height={20} />
          <span className="font-medium">
            Current Price is {range} your position price range.
          </span>
        </div>
      )}
      {isLoading || isLoadingBucketData ? (
        <SkeletonBox className="w-full h-[124px] rounded-md" />
      ) : (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className={classNames(outOfRange ? 'grayscale opacity-40' : '')}
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
              data={sparklineData ?? []}
              xScale={sparkLineXScale}
              height={height}
            />
            <g clipPath={`url(#${id}-chart-clip)`}>
              <rect
                x={0} // full width
                y={y ?? 0}
                width={width ?? 0}
                height={h ?? 0}
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
      )}
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
      y1={yScale(value) ?? 0}
      x1={lineStart ?? 0}
      y2={yScale(value) ?? 0}
      x2={lineStart + width}
    />
  )
}

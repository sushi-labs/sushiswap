import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api'
import { scaleLinear, scaleTime } from 'd3'
import { useId, useMemo } from 'react'
import { usePoolBuckets } from 'src/lib/hooks/api/use-pool-buckets'
import {
  type EvmAddress,
  type SushiSwapProtocol,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { Sparkline } from '~evm/[chainId]/_ui/add-liquidity/active-liquidity-chart/svg'
import { HorizontalLine } from './price-range-sparkline-clmm'

export const PriceRangeSparklineAmm = ({
  data,
}: { data: PortfolioV2PositionPoolType }) => {
  const id = useId()
  const { data: bucketData } = usePoolBuckets({
    chainId:
      isSushiSwapV2ChainId(data?.pool?.chainId) ||
      isSushiSwapV3ChainId(data?.pool?.chainId)
        ? data.pool.chainId
        : 1,
    poolAddress: data.pool.address as EvmAddress,
    protocol: data.pool.protocol as SushiSwapProtocol,
    enabled: Boolean(
      isSushiSwapV2ChainId(data?.pool?.chainId) ||
        isSushiSwapV3ChainId(data?.pool?.chainId),
    ),
  })
  const sparklineData = useMemo(() => {
    if (!bucketData?.dayBuckets) return []
    return bucketData.dayBuckets.map((bucket) => ({
      price: bucket.liquidityUSD,
      timestamp: bucket.date,
    }))
  }, [bucketData])

  const width = 452 + 64
  const height = 124

  const min = useMemo(
    () =>
      sparklineData.reduce(
        (min, d) => Math.min(min, d.price),
        sparklineData?.[0]?.price,
      ),
    [sparklineData],
  )

  const max = useMemo(
    () =>
      sparklineData.reduce(
        (max, d) => Math.max(max, d.price),
        sparklineData?.[0]?.price,
      ),
    [sparklineData],
  )

  const current = useMemo(
    () => sparklineData[sparklineData.length - 1]?.price,
    [sparklineData],
  )

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
        new Date(sparklineData?.[0]?.timestamp),
        new Date(sparklineData?.[sparklineData?.length - 1]?.timestamp),
      ])
      .range([0, width])
  }, [sparklineData])

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

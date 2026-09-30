'use client'

import { ChartBarIcon, InboxIcon, StopIcon } from '@heroicons/react-v1/solid'
import { SkeletonBox } from '@sushiswap/ui'
import { format } from 'd3'
import React, {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
import colors from 'tailwindcss/colors'

// Import shared chart components from EVM (they are network-agnostic)
import { Chart } from '~evm/[chainId]/_ui/liquidity-chart-range-input/chart'
import type {
  HandleType,
  ZoomLevels,
} from '~evm/[chainId]/_ui/liquidity-chart-range-input/types'

import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { poolPrice } from '~stellar/_common/lib/utils/liquidity-amounts'
import { type FeeTier, isFeeTier } from '~stellar/_common/lib/utils/ticks'
import { useDensityChartData } from '../../lib/hooks/tick/use-density-chart-data'

// Bound type for tick limits
enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

const ZOOM_LEVELS: Record<FeeTier, ZoomLevels> = {
  500: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  3000: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  10000: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
}

const DEFAULT_ZOOM_LEVEL: ZoomLevels = {
  initialMin: 0.5,
  initialMax: 2,
  min: 0.00001,
  max: 20,
}

interface InfoBoxProps {
  message?: ReactNode
  icon: ReactNode
}

const InfoBox: FC<InfoBoxProps> = ({ message, icon }) => {
  return (
    <div className="w-full items-center flex flex-col justify-center h-full bg-white dark:bg-white/[0.02] rounded-lg">
      {icon}
      {message && (
        <span className="font-medium text-sm mt-5 text-center p-2.5 dark:text-slate-400 text-slate-600">
          {message}
        </span>
      )}
    </div>
  )
}

interface LiquidityChartRangeInputProps {
  pool: PoolInfo | null | undefined
  ticksAtLimit?: { [_bound in Bound]?: boolean | undefined }
  // Human token1/token0 prices; inversion changes presentation, not this API.
  priceRange: { [_bound in Bound]: number }
  onLeftRangeInput?: (typedValue: string) => void
  onRightRangeInput?: (typedValue: string) => void
  interactive?: boolean
  hideBrushes?: boolean
  tokenToggle?: ReactNode
  inverted?: boolean
}

export function LiquidityChartRangeInput({
  pool,
  ticksAtLimit = { [Bound.LOWER]: false, [Bound.UPPER]: false },
  priceRange,
  onLeftRangeInput = () => {},
  onRightRangeInput = () => {},
  interactive = false,
  hideBrushes = true,
  tokenToggle,
  inverted = false,
}: LiquidityChartRangeInputProps) {
  const { isLoading, error, data } = useDensityChartData({
    pool,
    enabled: Boolean(pool),
  })

  const [isDefaultGraphRange, setIsDefaultGraphRange] = useState<boolean>(false)

  const priceScale = pool
    ? 10 ** (pool.token0.decimals - pool.token1.decimals)
    : 1
  const price = useMemo(() => {
    if (!pool) return undefined
    return poolPrice(
      pool.token0,
      pool.token1,
      pool.sqrtPriceX96,
      inverted,
    ).toNumber()
  }, [pool, inverted])
  const chartData = useMemo(() => {
    const scaled = data
      ?.map((entry) => ({
        ...entry,
        price0: inverted
          ? 1 / (entry.price0 * priceScale)
          : entry.price0 * priceScale,
      }))
      .filter((entry) => Number.isFinite(entry.price0) && entry.price0 > 0)
    return inverted ? scaled?.reverse() : scaled
  }, [data, priceScale, inverted])

  const feeAmount = pool?.fee

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      const leftRangeValue = inverted ? 1 / domain[1] : domain[0]
      const rightRangeValue = inverted ? 1 / domain[0] : domain[1]

      onLeftRangeInput(leftRangeValue.toString())
      onRightRangeInput(rightRangeValue.toString())

      if (mode === 'reset') {
        setIsDefaultGraphRange(true)
      } else {
        setIsDefaultGraphRange(false)
      }
    },
    [onLeftRangeInput, onRightRangeInput, inverted],
  )

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const lower = priceRange[Bound.LOWER]
    const upper = priceRange[Bound.UPPER]
    return inverted ? [1 / upper, 1 / lower] : [lower, upper]
  }, [priceRange, inverted])

  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) return ''

      if (d === 'w' && ticksAtLimit[inverted ? Bound.UPPER : Bound.LOWER])
        return '0'
      if (d === 'e' && ticksAtLimit[inverted ? Bound.LOWER : Bound.UPPER])
        return '∞'

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100

      return price
        ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%`
        : ''
    },
    [price, ticksAtLimit, inverted],
  )

  // Only consider uninitialized when no pool is provided
  // When pool exists but data is undefined/empty, that's handled by "no liquidity data" case
  const isUninitialized = !pool

  const getNewRangeWhenBrushing = useCallback(
    (
      _range: [number, number],
      _movingHandle: HandleType | undefined,
    ): [number, number] | undefined => {
      // For now, just return undefined to use default behavior
      return undefined
    },
    [],
  )

  const zoomLevels =
    feeAmount && isFeeTier(feeAmount)
      ? ZOOM_LEVELS[feeAmount]
      : DEFAULT_ZOOM_LEVEL

  return (
    <div className="grid auto-rows-auto gap-3 min-h-[300px] overflow-hidden">
      {isUninitialized ? (
        <div className="flex flex-col gap-2">
          {tokenToggle}
          <InfoBox
            message="Your position will appear here."
            icon={
              <InboxIcon
                width={16}
                stroke="currentColor"
                className="text-slate-200"
              />
            }
          />
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {tokenToggle}
          <InfoBox icon={<SkeletonBox className="w-full h-full" />} />
        </div>
      ) : error ? (
        <div className="flex flex-col gap-2">
          {tokenToggle}
          <InfoBox
            message="Liquidity data not available."
            icon={
              <StopIcon
                width={16}
                stroke="currentColor"
                className="dark:text-slate-400 text-slate-600"
              />
            }
          />
        </div>
      ) : !chartData || chartData.length === 0 || !price ? (
        <div className="flex flex-col gap-2">
          {tokenToggle}
          <InfoBox
            message="There is no liquidity data."
            icon={
              <ChartBarIcon
                width={16}
                stroke="currentColor"
                className="dark:text-slate-400 text-slate-600"
              />
            }
          />
        </div>
      ) : (
        <div className="relative items-center justify-center">
          <Chart
            data={{ series: chartData, current: price }}
            dimensions={{ width: 400, height: 300 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: colors.blue['500'],
              },
              brush: {
                handle: {
                  west: colors.blue['600'],
                  east: colors.blue['600'],
                },
              },
            }}
            interactive={interactive && Boolean(data?.length)}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            getNewRangeWhenBrushing={getNewRangeWhenBrushing}
            zoomLevels={zoomLevels}
            isPriceRangeSet={!isDefaultGraphRange}
            hideBrushes={hideBrushes}
            tokenToggle={tokenToggle}
          />
        </div>
      )}
    </div>
  )
}

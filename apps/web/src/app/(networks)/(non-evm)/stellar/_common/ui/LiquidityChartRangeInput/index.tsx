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
import { Chart } from '~evm/[chainId]/_ui/LiquidityChartRangeInput/chart'
import type {
  HandleType,
  ZoomLevels,
} from '~evm/[chainId]/_ui/LiquidityChartRangeInput/types'

import { calculatePriceFromTick } from '~stellar/_common/lib/soroban/pool-helpers'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
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
  priceRange: { [_bound in Bound]: number }
  onLeftRangeInput?: (typedValue: string) => void
  onRightRangeInput?: (typedValue: string) => void
  interactive?: boolean
  hideBrushes?: boolean
  tokenToggle?: ReactNode
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
}: LiquidityChartRangeInputProps) {
  const { isLoading, error, data } = useDensityChartData({
    pool,
    enabled: Boolean(pool),
  })

  const [isDefaultGraphRange, setIsDefaultGraphRange] = useState<boolean>(false)

  // Calculate current price from tick
  const price = useMemo(() => {
    if (!pool) return undefined
    return calculatePriceFromTick(pool.tick)
  }, [pool])

  const feeAmount = pool?.fee as FeeTier | undefined

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      const leftRangeValue = Number(domain[0])
      const rightRangeValue = Number(domain[1])

      onLeftRangeInput(leftRangeValue.toString())
      onRightRangeInput(rightRangeValue.toString())

      if (mode === 'reset') {
        setIsDefaultGraphRange(true)
      } else {
        setIsDefaultGraphRange(false)
      }
    },
    [onLeftRangeInput, onRightRangeInput],
  )

  const brushDomain: [number, number] | undefined = useMemo(() => {
    return [priceRange[Bound.LOWER], priceRange[Bound.UPPER]]
  }, [priceRange])

  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) return ''

      if (d === 'w' && ticksAtLimit[Bound.LOWER]) return '0'
      if (d === 'e' && ticksAtLimit[Bound.UPPER]) return '∞'

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100

      return price
        ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%`
        : ''
    },
    [price, ticksAtLimit],
  )

  const isUninitialized = !pool || (data === undefined && !isLoading)

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
      ) : !data || data.length === 0 || !price ? (
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
            data={{ series: data, current: price }}
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

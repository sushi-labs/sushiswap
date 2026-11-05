import { ChartBarIcon, InboxIcon, StopIcon } from '@heroicons/react-v1/solid'
import { SkeletonBox } from '@sushiswap/ui'
import { format } from 'd3'
import React, {
  type FC,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
} from 'react'
import { Bound } from 'src/lib/constants'
import { formatTypedPriceNumber } from 'src/lib/pool/cl'
import type { Price } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TICK_SPACINGS,
  getPriceRangeWithTokenRatio,
} from 'sushi/evm'
import colors from 'tailwindcss/colors'

import { Chart } from './chart'
import { useDensityChartData } from './hooks'
import type { ChartEntry, HandleType, ZoomLevels } from './types'

const brushKeyToFieldKey: Record<HandleType, 'LOWER' | 'UPPER'> = {
  e: 'LOWER',
  w: 'UPPER',
}

const TIGHT_ZOOM: ZoomLevels = {
  initialMin: 0.999,
  initialMax: 1.001,
  min: 0.00001,
  max: 1.5,
}
const WIDE_ZOOM: ZoomLevels = {
  initialMin: 0.5,
  initialMax: 2,
  min: 0.00001,
  max: 20,
}

/** Zoom close in for pools with tight ticks (V3's 0.01% and 0.05% tiers). */
export function getZoomLevels(tickSpacing: number | undefined): ZoomLevels {
  return tickSpacing !== undefined && tickSpacing <= 10 ? TIGHT_ZOOM : WIDE_ZOOM
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
        <span className="font-medium text-sm mt-5 text-center p-2.5 text-gray-600 dark:text-slate-400 text-slate-600">
          {message}
        </span>
      )}
    </div>
  )
}

type LiquidityChartRangeInputProps = {
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  ticksAtLimit: { [_bound in Bound]?: boolean | undefined }
  priceRange: number | undefined
  price: number | undefined
  priceLower?: Price<EvmCurrency, EvmCurrency>
  priceUpper?: Price<EvmCurrency, EvmCurrency>
  weightLockedCurrencyBase: number | undefined
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  interactive: boolean
  hideBrushes?: boolean
  tokenToggle?: ReactNode
}

export function LiquidityChartRangeInput({
  chainId,
  feeAmount,
  ...props
}: LiquidityChartRangeInputProps & {
  chainId: SushiSwapV3ChainId
  feeAmount?: SushiSwapV3FeeAmount
  /** Whether currencyA is the pool's currency0. */
  isSorted: boolean
}): ReactElement {
  const { currencyA, currencyB } = props
  const densityData = useDensityChartData({
    chainId,
    token0: currencyA,
    token1: currencyB,
    feeAmount,
  })

  return (
    <LiquidityChartRangeInputView
      {...props}
      densityData={densityData}
      zoomLevels={getZoomLevels(
        feeAmount ? TICK_SPACINGS[feeAmount] : undefined,
      )}
    />
  )
}

/** The range chart over density data from any concentrated liquidity pool. */
export function LiquidityChartRangeInputView({
  currencyA,
  currencyB,
  ticksAtLimit,
  priceRange,
  price,
  priceLower,
  priceUpper,
  weightLockedCurrencyBase,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
  hideBrushes = false,
  tokenToggle,
  densityData: { isLoading, error, data },
  zoomLevels,
  isSorted,
}: LiquidityChartRangeInputProps & {
  densityData: {
    isLoading: boolean
    error: unknown
    data: ChartEntry[] | undefined
  }
  zoomLevels: ZoomLevels
  /** Whether currencyA is the pool's currency0. */
  isSorted: boolean
}): ReactElement {
  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert()
    const rightPrice = isSorted ? priceUpper : priceLower?.invert()

    return leftPrice && rightPrice
      ? [
          Number.parseFloat(leftPrice?.toSignificant(6)),
          Number.parseFloat(rightPrice?.toSignificant(6)),
        ]
      : undefined
  }, [isSorted, priceLower, priceUpper])

  const onBrushDomainChangeEnded = useCallback(
    (
      domain: [number, number],
      mode: string | undefined,
      moved: [left: boolean, right: boolean] = [true, true],
    ) => {
      let leftRangeValue = Number(domain[0])
      const rightRangeValue = Number(domain[1])

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6
      }

      // Only input a bound the drag moved, so an untouched one isn't replaced
      // by its rounded price. With no range yet, both are new.
      const [leftMoved, rightMoved] = brushDomain ? moved : [true, true]

      // simulate user input for auto-formatting and other validations
      if (
        leftMoved &&
        (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
          mode === 'handle' ||
          mode === 'reset') &&
        leftRangeValue > 0
      ) {
        onLeftRangeInput(formatTypedPriceNumber(leftRangeValue))
      }

      if (
        rightMoved &&
        (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
          mode === 'reset') &&
        rightRangeValue > 0
      ) {
        onRightRangeInput(formatTypedPriceNumber(rightRangeValue))
      }
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit, brushDomain],
  )

  interactive = interactive && Boolean(data?.length)

  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) return ''

      if (d === 'w' && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER])
        return '0'
      if (d === 'e' && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER])
        return '∞'

      const percent =
        (x < price ? -1 : 1) *
        ((Math.max(x, price) - Math.min(x, price)) / price) *
        100

      return price
        ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%`
        : ''
    },
    [isSorted, price, ticksAtLimit],
  )

  const isUninitialized =
    !currencyA || !currencyB || (data === undefined && !isLoading && !error)

  /**
   * If user locked a desired token weight, we need to compute a correct price range when user is brushing.
   * Note that when brushing, the `range` given from the brush event is NOT necessarily equal to what is displayed on the screen.
   */
  const getNewRangeWhenBrushing = useCallback(
    (
      range: [number, number],
      movingHandle: HandleType | undefined,
    ): [number, number] | undefined => {
      if (
        typeof price !== 'number' ||
        !movingHandle ||
        typeof weightLockedCurrencyBase !== 'number'
      )
        return undefined
      try {
        return getPriceRangeWithTokenRatio(
          price,
          range[0],
          range[1],
          brushKeyToFieldKey[movingHandle],
          weightLockedCurrencyBase,
        )
      } catch {
        // No range has the weight with that bound, e.g. one at the price
        return undefined
      }
    },
    [price, weightLockedCurrencyBase],
  )

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
            interactive={interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            getNewRangeWhenBrushing={getNewRangeWhenBrushing}
            zoomLevels={zoomLevels}
            isPriceRangeSet={priceRange !== undefined}
            hideBrushes={hideBrushes}
            tokenToggle={tokenToggle}
          />
        </div>
      )}
    </div>
  )
}

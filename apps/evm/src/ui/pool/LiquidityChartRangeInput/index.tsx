import { ChartBarIcon, InboxIcon, StopIcon } from '@heroicons/react-v1/solid'
import { SkeletonBox } from '@sushiswap/ui/components/skeleton'
import {
  FeeAmount,
  SushiSwapV3ChainId,
  getPriceRangeWithTokenRatio,
} from '@sushiswap/v3-sdk'
import { format } from 'd3'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { Bound } from 'src/lib/constants'
import { Price, Token, Type } from 'sushi/currency'
import colors from 'tailwindcss/colors'

import { Chart } from './Chart'
import { useDensityChartData } from './hooks'
import { HandleType, ZoomLevels } from './types'

const brushKeyToFieldKey: Record<HandleType, 'LOWER' | 'UPPER'> = {
  e: 'LOWER',
  w: 'UPPER',
}

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.LOW]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
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

export default function LiquidityChartRangeInput({
  chainId,
  currencyA,
  currencyB,
  feeAmount,
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
}: {
  chainId: SushiSwapV3ChainId
  currencyA: Type | undefined
  currencyB: Type | undefined
  feeAmount?: FeeAmount
  ticksAtLimit: { [_bound in Bound]?: boolean | undefined }
  priceRange: number | undefined
  price: number | undefined
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  weightLockedCurrencyBase: number | undefined
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  interactive: boolean
  hideBrushes?: boolean
}) {
  const isSorted =
    currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped)

  const { isLoading, error, data } = useDensityChartData({
    chainId,
    token0: currencyA,
    token1: currencyB,
    feeAmount,
  })

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0])
      const rightRangeValue = Number(domain[1])

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6
      }

      // simulate user input for auto-formatting and other validations
      if (
        (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
          mode === 'handle' ||
          mode === 'reset') &&
        leftRangeValue > 0
      ) {
        onLeftRangeInput(leftRangeValue.toFixed(6))
      }

      if (
        (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
          mode === 'reset') &&
        rightRangeValue > 0
      ) {
        // todo: remove this check. Upper bound for large numbers
        // sometimes fails to parse to tick.
        if (rightRangeValue < 1e35) {
          onRightRangeInput(rightRangeValue.toFixed(6))
        }
      }
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
  )

  interactive = interactive && Boolean(data?.length)

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert()
    const rightPrice = isSorted ? priceUpper : priceLower?.invert()

    return leftPrice && rightPrice
      ? [
          parseFloat(leftPrice?.toSignificant(6)),
          parseFloat(rightPrice?.toSignificant(6)),
        ]
      : undefined
  }, [isSorted, priceLower, priceUpper])

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
    !currencyA || !currencyB || (data === undefined && !isLoading)

  /**
   * If user locked a desired token weight, we need to compute a correct price range when user is brushing.
   * Note that when brushing, the `range` given from the brush event is NOT necessarily equal to what is displayed on the screen.
   */
  const getNewRangeWhenBrushing = useCallback(
    (
      range: [number, number],
      movingHandle: HandleType | undefined,
    ): [number, number] | undefined => {
      if (!price || !movingHandle || !weightLockedCurrencyBase) return undefined
      return getPriceRangeWithTokenRatio(
        price,
        range[0],
        range[1],
        brushKeyToFieldKey[movingHandle],
        weightLockedCurrencyBase,
      )
    },
    [price, weightLockedCurrencyBase],
  )

  return (
    <div className="grid auto-rows-auto gap-3 min-h-[300px] overflow-hidden">
      {isUninitialized ? (
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
      ) : isLoading ? (
        <InfoBox icon={<SkeletonBox className="w-full h-full" />} />
      ) : error ? (
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
      ) : !data || data.length === 0 || !price ? (
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
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            priceRange={priceRange}
            hideBrushes={hideBrushes}
          />
        </div>
      )}
    </div>
  )
}

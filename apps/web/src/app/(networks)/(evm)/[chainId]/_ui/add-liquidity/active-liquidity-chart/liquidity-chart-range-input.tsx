import { ChartBarIcon, InboxIcon, StopIcon } from '@heroicons/react-v1/solid'
import { SkeletonBox } from '@sushiswap/ui'
import { format } from 'd3'
import React, { type FC, type ReactNode, useCallback, useMemo } from 'react'
import { Bound } from 'src/lib/constants'
import type { Price } from 'sushi'
import {
  type EvmCurrency,
  type EvmToken,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  getPriceRangeWithTokenRatio,
} from 'sushi/evm'
import { ActiveLiquidityChart } from './active-liquidity-chart'
import { useDensityChartData } from './hooks'
import type { HandleType, ZoomLevels } from './types'

const brushKeyToFieldKey: Record<HandleType, 'LOWER' | 'UPPER'> = {
  e: 'LOWER',
  w: 'UPPER',
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

export const LiquidityChartRangeInput = ({
  chainId,
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  weightLockedCurrencyBase,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,

  tokenToggle,
}: {
  chainId: SushiSwapV3ChainId
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  feeAmount?: SushiSwapV3FeeAmount
  ticksAtLimit: { [_bound in Bound]?: boolean | undefined }
  price: number | undefined
  priceLower?: Price<EvmToken, EvmToken>
  priceUpper?: Price<EvmToken, EvmToken>
  weightLockedCurrencyBase: number | undefined
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  interactive: boolean
  tokenToggle?: ReactNode
}) => {
  const isSorted =
    currencyA && currencyB && currencyA?.wrap().sortsBefore(currencyB?.wrap())

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
          Number.parseFloat(leftPrice?.toSignificant(6)),
          Number.parseFloat(rightPrice?.toSignificant(6)),
        ]
      : undefined
  }, [isSorted, priceLower, priceUpper])

  const _brushLabelValue = useCallback(
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
  const _getNewRangeWhenBrushing = useCallback(
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
          <ActiveLiquidityChart
            tokenToggle={tokenToggle}
            data={{
              series: data,
              current: price,
              min: price / 2, //todo: when have data lowest token price
              // max: brushDomain?.[1] || 1, //todo: when have data highest token price
              max: price * 2, //todo: when have data highest token price
            }}
            disableBrushInteraction={false}
            brushDomain={brushDomain}
            dimensions={{
              width: 452 + 64,
              height: 124,
              contentWidth: 68,
              axisLabelPaneWidth: 64,
            }}
            onBrushDomainChange={(
              domain: [number, number],
              mode?: string,
            ): void => {
              // You can zoom out far enough to set an invalid range, so we prevent that here.
              if (domain[0] < 0) {
                return
              }
              onBrushDomainChangeEnded(domain, mode)
              // While scrolling we receive updates to the range because the yScale changes,
              // but we can filter them out because they have an undefined "mode".
              // The initial range suggestion also comes with an undefined "mode", so we allow that here.
              // const rejectAutoRangeSuggestion =
              //   minPrice !== undefined && maxPrice !== undefined && minPrice >= 0 && maxPrice >= 0
              // if (!mode && rejectAutoRangeSuggestion) {
              //   return
              // }
              // setMinPrice(domain[0])
              // setMaxPrice(domain[1])
            }}
          />
        </div>
      )}
    </div>
  )
}

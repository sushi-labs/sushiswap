import { InboxIcon } from '@heroicons/react/outline'
import { BanIcon, ChartBarIcon } from '@heroicons/react/solid'
import { ConstantProductPool } from '@sushiswap/amm'
import { Price, Token, Type } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import { usePrevious } from '@sushiswap/hooks'
import { Loader } from '@sushiswap/ui'
import { format } from 'd3'
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { batch } from 'react-redux'

import { Bound } from '../../lib/constants'
import theme from '../../tailwind.config'
import { Chart } from './Chart'
import { useDensityChartData } from './hooks'
import { ZoomLevels } from './types'
import { VisiblilitySelector } from './VisibilitySelector'

export const TIER_COLORS = [
  theme.colors().blue,
  theme.colors().yellow,
  theme.colors.red(),
  theme.colors.green(),
  theme.colors(400).yellow,
  theme.colors(400).red,
]

const SMALL_ZOOM_LEVEL: ZoomLevels = {
  initialMin: 1 / 1.001,
  initialMax: 1.001,
  min: 0.00001,
  max: 1.5,
}

const MEDIUM_ZOOM_LEVEL: ZoomLevels = {
  initialMin: 1 / 1.2,
  initialMax: 1.2,
  min: 0.00001,
  max: 20,
}

const LARGE_ZOOM_LEVEL: ZoomLevels = {
  initialMin: 1 / 2,
  initialMax: 2,
  min: 0.00001,
  max: 20,
}

const getZoomLevel = (tickSpacing?: number) => {
  if (tickSpacing == null) return LARGE_ZOOM_LEVEL
  return tickSpacing < 15 ? SMALL_ZOOM_LEVEL : tickSpacing < 50 ? MEDIUM_ZOOM_LEVEL : LARGE_ZOOM_LEVEL
}

interface InfoBoxProps {
  message?: ReactNode
  icon: ReactNode
}

const InfoBox: FC<InfoBoxProps> = ({ message, icon }) => {
  return (
    <div className="w-full items-center flex flex-col justify-center h-full">
      {icon}
      {message && <span className="mt-5 p-2.5">{message}</span>}
    </div>
  )
}

interface LiquidityChartRangeInputProps {
  currencyA: Type | undefined
  currencyB: Type | undefined
  // TODO RAMIN: CHANGE TO CONCENTRATED
  pool: ConstantProductPool | undefined
  tierId?: number
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
  price: number | undefined
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  interactive: boolean
}

export const LiquidityChartRangeInput: FC<LiquidityChartRangeInputProps> = ({
  currencyA,
  currencyB,
  pool,
  tierId,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
}) => {
  const previousTierId = usePrevious(tierId)

  const keys = useMemo(() => pool?.tiers.map((tier) => `${formatPercent(tier.feePercent)}%`) ?? [], [pool])
  const [hiddenKeyIndexes, setHiddenKeyIndexes] = useState<number[]>([])

  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped)

  const { isLoading, isUninitialized, isError, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    tierId,
  })

  const onBrushDomainChangeEnded = useCallback(
    (domain, mode) => {
      let leftRangeValue = Number(domain[0])
      const rightRangeValue = Number(domain[1])

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6
      }

      batch(() => {
        // simulate user input for auto-formatting and other validations
        if (
          (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] || mode === 'handle' || mode === 'reset') &&
          leftRangeValue > 0
        ) {
          onLeftRangeInput(leftRangeValue.toFixed(6))
        }

        if ((!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === 'reset') && rightRangeValue > 0) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(rightRangeValue.toFixed(6))
          }
        }
      })
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit]
  )

  interactive = interactive && Boolean(formattedData?.length)

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert()
    const rightPrice = isSorted ? priceUpper : priceLower?.invert()

    return leftPrice && rightPrice
      ? [parseFloat(leftPrice?.toSignificant(6)), parseFloat(rightPrice?.toSignificant(6))]
      : undefined
  }, [isSorted, priceLower, priceUpper])

  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) return ''

      if (d === 'w' && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) return '0'
      if (d === 'e' && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) return '∞'

      const percent = (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100

      return price ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%` : ''
    },
    [isSorted, price, ticksAtLimit]
  )

  const onToggleVisibility = useCallback((index: number) => {
    setHiddenKeyIndexes((preVal) => {
      const curIndex = preVal.findIndex((val) => val === index)
      if (curIndex < 0) {
        return [...preVal, index]
      }
      return preVal.filter((val) => val !== index)
    })
  }, [])

  useEffect(() => {
    setHiddenKeyIndexes([])
  }, [keys])

  useEffect(() => {
    if (typeof tierId === 'number' && previousTierId !== tierId && hiddenKeyIndexes.includes(tierId)) {
      setHiddenKeyIndexes(hiddenKeyIndexes.filter((val) => val !== tierId))
    }
  }, [hiddenKeyIndexes, tierId, previousTierId])

  return (
    <div className="grid grid-rows-auto gap-3 min-h-[175px]">
      {isUninitialized ? (
        <InfoBox
          message="Your position will appear here."
          icon={<InboxIcon width={56} stroke="currentColor" className="text-slate-200" />}
        />
      ) : isLoading ? (
        <InfoBox icon={<Loader size={40} />} />
      ) : isError ? (
        <InfoBox
          message="Liquidity data not available."
          icon={<BanIcon width={56} stroke="currentColor" className="text-slate-400" />}
        />
      ) : !formattedData || !price ? (
        <InfoBox
          message="There is no liquidity data."
          icon={<ChartBarIcon width={56} stroke="currentColor" className="text-slate-400" />}
        />
      ) : (
        <>
          <div className="relative justify-center items-center">
            <Chart
              data={{ series: formattedData, current: price }}
              keys={keys}
              hiddenKeyIndexes={hiddenKeyIndexes}
              selectedKeyIndex={tierId}
              dimensions={{ width: 400, height: 175 }}
              margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
              styles={{
                area: {
                  colors: TIER_COLORS,
                },
                brush: {
                  handle: {
                    west: theme.colors().red,
                    east: theme.colors().blue,
                  },
                },
              }}
              interactive={interactive}
              brushLabels={brushLabelValue}
              brushDomain={brushDomain}
              onBrushDomainChange={onBrushDomainChangeEnded}
              zoomLevels={getZoomLevel(pool?.tickSpacing)}
              ticksAtLimit={ticksAtLimit}
            />
          </div>
          {keys.length > 1 && (
            <VisiblilitySelector
              options={keys}
              hiddenOptionsIndexes={hiddenKeyIndexes}
              selectedKeyIndex={tierId}
              onToggleOption={onToggleVisibility}
              colors={TIER_COLORS}
            />
          )}
        </>
      )}
    </div>
  )
}

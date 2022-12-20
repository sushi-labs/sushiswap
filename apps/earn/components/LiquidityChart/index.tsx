import { BanIcon, ChartBarIcon, InboxIcon } from '@heroicons/react/outline'
import { Price, Token, Type } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import { Loader } from '@sushiswap/ui'
import * as d3 from 'd3'
import { FC, ReactNode, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { batch } from 'react-redux'

import theme from '../../tailwind.config'
import { Chart } from './Chart'
import { useIsChanging } from './hooks/useIsChanging'
import { useLiquidityChartData } from './hooks/useLiquidityChartData'
import { VisiblilitySelector } from './periphery/VisibilitySelector'
import { ZoomControl } from './periphery/ZoomControl'
import { getPriceRangeWithTokenRatio } from './utils/getPriceRangeWithTokenRatio'
import { toFixed } from './utils/processData'
import { HandleType, PoolState, ZoomLevel } from './utils/types'

const TIER_COLORS = [
  theme.colors().blue,
  theme.colors().yellow,
  theme.colors().red,
  theme.colors().green,
  theme.colors(400).yellow,
  theme.colors(400).red,
]

const SIZE = {
  width: 464,
  height: 200,
  margin: { top: 0, right: 0, bottom: 25, left: 0 },
}

const SMALL_ZOOM_LEVEL: ZoomLevel = {
  initialMin: 1 / 1.001,
  initialMax: 1.001,
  min: 1e-45, // 0.00001,
  max: 1.5,
}

const MEDIUM_ZOOM_LEVEL: ZoomLevel = {
  initialMin: 1 / 1.2,
  initialMax: 1.2,
  min: 1e-45, // 0.00001,
  max: 20,
}

const LARGE_ZOOM_LEVEL: ZoomLevel = {
  initialMin: 1 / 2,
  initialMax: 2,
  min: 1e-45, // 0.00001,
  max: 20,
}

const getZoomLevel = (tickSpacing?: number) => {
  if (tickSpacing == null) return LARGE_ZOOM_LEVEL
  return tickSpacing < 15 ? SMALL_ZOOM_LEVEL : tickSpacing < 50 ? MEDIUM_ZOOM_LEVEL : LARGE_ZOOM_LEVEL
}

const InfoBox = ({ message, icon }: { message?: ReactNode; icon: ReactNode }) => (
  <div className="w-full items-center gap-2">
    <span className="text-slate-400">{icon}</span>
    {message && <span className="font-medium text-lg text-slate-200">{message}</span>}
  </div>
)

const brushKeyToFieldKey: Record<HandleType, 'LOWER' | 'UPPER'> = {
  e: 'LOWER',
  w: 'UPPER',
}

interface LiquidityChartProps {
  currencyBase: Type | undefined
  currencyQuote: Type | undefined
  tierId: number | undefined
  priceLower: Price<Token, Token> | undefined
  priceUpper: Price<Token, Token> | undefined
  weightLockedCurrencyBase: number | undefined
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  setIndependentRangeField: (field: 'LOWER' | 'UPPER') => void
  resetRangeNonce?: any
}

export const LiquidityChart: FC<LiquidityChartProps> = ({
  currencyBase,
  currencyQuote,
  tierId,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  weightLockedCurrencyBase,
  onRightRangeInput,
  setIndependentRangeField,
  resetRangeNonce,
}) => {
  const { invertPrice, queryState, priceLiquidityDataList, poolState, pool } = useLiquidityChartData(
    currencyBase,
    currencyQuote
  )

  const priceCurrent = useMemo(() => {
    if (!pool || tierId == null) return undefined
    // Fallback the first tier's price if tier is not found (i.e. creating tier)
    const token0Price = (pool.tiers[tierId] ?? pool.tiers[0])?.token0Price
    if (!token0Price) return undefined
    return invertPrice ? token0Price.invert().toSignificant(4) : token0Price.toSignificant(4)
  }, [pool, tierId, invertPrice])

  const onSelectedRangeChange = useCallback(
    (rawRange: [number, number] | null, lastMovingHandle: HandleType | undefined) => {
      batch(() => {
        if (lastMovingHandle) setIndependentRangeField(brushKeyToFieldKey[lastMovingHandle])
        onLeftRangeInput(rawRange ? toFixed(Math.max(rawRange[0], MIN_PRICE_INPUT)) : '')
        onRightRangeInput(rawRange ? toFixed(Math.max(rawRange[1], MIN_PRICE_INPUT)) : '')
      })
    },
    [onLeftRangeInput, onRightRangeInput, setIndependentRangeField]
  )

  const getHandleLabelText = useCallback(
    (rawRange: [number, number] | null): [string, string] => {
      if (!priceCurrent || !rawRange) return ['', '']
      return rawRange.map((price) => {
        const percent = ((price - priceCurrent) / priceCurrent) * 100
        return `${d3.format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%`
      }) as [string, string]
    },
    [priceCurrent]
  )

  const [hideTiers, setHideTiers] = useState<Record<number, boolean>>({})
  const onToggleTierVisibility = useCallback((i: number) => setHideTiers((state) => ({ ...state, [i]: !state[i] })), [])

  const priceRange = useMemo(() => {
    return priceLower && priceUpper
      ? ([+priceLower.toSignificant(4), +priceUpper.toSignificant(4)] as [number, number])
      : null
  }, [priceLower, priceUpper])

  const [zoomInNonce, zoomIn] = useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)
  const [zoomOutNonce, zoomOut] = useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)
  const [zoomToFitRangeNonce, zoomToFitRange] = useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)

  const resetRange = useCallback(() => {
    if (priceCurrent != null) {
      const zoomLevel = getZoomLevel(pool?.tickSpacing)
      onSelectedRangeChange([priceCurrent * zoomLevel.initialMin, priceCurrent * zoomLevel.initialMax], undefined)
    }
  }, [priceCurrent, pool?.tickSpacing, onSelectedRangeChange])

  /**
   * Reset range if requested or if the bases or selected tier change
   */
  const poolIdChanged = useIsChanging(pool?.poolId)
  const tierIdChanged = useIsChanging(tierId)
  const resetRangeNonceChanged = useIsChanging(resetRangeNonce)
  useEffect(() => {
    if (!poolIdChanged && !tierIdChanged && !resetRangeNonceChanged) return
    resetRange()
    setHideTiers({})
    const id = setTimeout(() => zoomToFitRange(), 100) // delay to let range reset first before zoom
    return () => clearTimeout(id)
  }, [poolIdChanged, tierIdChanged, resetRangeNonceChanged, resetRange])

  const sqrtGammas = useMemo(() => pool?.tiers.map((tier) => `${formatPercent(tier.feePercent)}%`) ?? [], [pool])

  /**
   * If user locked a desired token weight, we need to compute a correct price range when user is brushing.
   * Note that when brushing, the `range` given from the brush event is NOT necessarily equal to what is displayed on the screen.
   */
  const getNewRangeWhenBrushing = useCallback(
    (range: [number, number], movingHandle: HandleType | undefined): [number, number] | undefined => {
      if (priceCurrent == null || movingHandle == null || weightLockedCurrencyBase == null) return undefined
      return getPriceRangeWithTokenRatio(
        priceCurrent,
        range[0],
        range[1],
        brushKeyToFieldKey[movingHandle],
        weightLockedCurrencyBase
      )
    },
    [priceCurrent, weightLockedCurrencyBase]
  )

  return (
    <div className="flex flex-col min-h-[180px] items-stretch justify-center relative">
      {queryState.isUninitialized || tierId == null ? (
        <InfoBox message="Liquidity chart will appear here" icon={<InboxIcon width={56} />} />
      ) : queryState.isLoading || poolState === PoolState.LOADING || !pool || priceCurrent == null ? (
        <InfoBox icon={<Loader size={40} />} />
      ) : queryState.isError ? (
        <InfoBox message="There is no liquidity data" icon={<ChartBarIcon width={56} />} />
      ) : !priceLiquidityDataList ? (
        <InfoBox message="Liquidity data not available" icon={<BanIcon width={56} />} />
      ) : (
        <div>
          <ZoomControl
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            zoomToFitSelectedRange={zoomToFitRange}
            resetRange={resetRange}
            showResetButton={false} // NOTE: disabled reset range button
          />
          <div className="h-3" />
          <Chart
            size={SIZE}
            zoomLevel={getZoomLevel(pool.tickSpacing)}
            dataList={priceLiquidityDataList}
            midPoint={priceCurrent}
            hideData={hideTiers}
            snappedSelectedRange={priceRange}
            handleSelectedRangeChange={onSelectedRangeChange}
            getNewRangeWhenBrushing={getNewRangeWhenBrushing}
            zoomInNonce={zoomInNonce}
            zoomOutNonce={zoomOutNonce}
            zoomToFitSelectedRangeNonce={zoomToFitRangeNonce}
            getHandleLabelText={getHandleLabelText}
            areaColors={TIER_COLORS}
            brushHandleColors={{
              w: '#DA2D2B',
              e: '#0068FC',
            }}
          />
          <div className="h-2" />
          {sqrtGammas.length > 1 && (
            <VisiblilitySelector
              displayTexts={sqrtGammas}
              colors={TIER_COLORS}
              isHidden={hideTiers}
              onToggleVisibility={onToggleTierVisibility}
            />
          )}
        </div>
      )}
    </div>
  )
}

const MIN_PRICE_INPUT = 1e-35

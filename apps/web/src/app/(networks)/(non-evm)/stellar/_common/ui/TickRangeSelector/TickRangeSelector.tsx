'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import { Toggle } from '@sushiswap/ui'
import {
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  useCallback,
  useMemo,
} from 'react'
import { PriceBlock } from 'src/lib/components/price-block'
import { Price } from 'sushi'
import type { StellarToken } from 'sushi/stellar'
import type { TickRangeSelectorState } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import {
  calculatePriceFromTick,
  calculateTickFromPrice,
} from '~stellar/_common/lib/soroban'
import {
  MAX_TICK_RANGE,
  alignTick,
  clampTickRange,
} from '~stellar/_common/lib/utils/ticks'
import { DefaultTickRangeSelector } from './default-tick-range-selector'

interface TickRangeSelectorProps {
  params: TickRangeSelectorState
  token0?: StellarToken
  token1?: StellarToken
  inverted?: boolean
  variant?: 'default' | 'cards'
}

export interface PriceRangePreset {
  label: string
  lower: number
  upper: number
}

export type PriceRangeBound = 'min' | 'max'

export function TickRangeSelector({
  params,
  token0,
  token1,
  inverted = false,
  variant = 'default',
}: TickRangeSelectorProps): ReactElement {
  const {
    currentTick,
    tickLower,
    tickUpper,
    tickSpacing,
    isTickRangeValid,
    setTickLower,
    setTickUpper,
    isDynamic,
    setIsDynamic,
    applyPresetRange,
    dynamicOffsets,
  } = params

  const maxTickRange = useMemo(
    () =>
      clampTickRange(MAX_TICK_RANGE.lower, MAX_TICK_RANGE.upper, tickSpacing),
    [tickSpacing],
  )

  const createPercentPreset = useCallback(
    (label: string, fraction: number): PriceRangePreset => {
      const multiplier = 1 + fraction
      const range = clampTickRange(
        currentTick + calculateTickFromPrice(1 / multiplier),
        currentTick + calculateTickFromPrice(multiplier),
        tickSpacing,
      )

      return { label, ...range }
    },
    [currentTick, tickSpacing],
  )

  const presets = useMemo<PriceRangePreset[]>(
    () => [
      { label: 'Full Range', ...maxTickRange },
      createPercentPreset('×÷2', 1),
      createPercentPreset('×÷1.2', 0.2),
      createPercentPreset('×÷1.01', 0.01),
    ],
    [createPercentPreset, maxTickRange],
  )

  const activePreset = presets.find(
    (preset) =>
      isDynamic &&
      dynamicOffsets?.lower === preset.lower - currentTick &&
      dynamicOffsets.upper === preset.upper - currentTick,
  )

  const displayTick = useCallback(
    (bound: PriceRangeBound): number => {
      if (bound === 'min') {
        return inverted ? tickUpper : tickLower
      }

      return inverted ? tickLower : tickUpper
    },
    [inverted, tickLower, tickUpper],
  )

  const formatTick = useCallback(
    (tick: number, bound: PriceRangeBound): string => {
      if (!token0 || !token1) {
        return ''
      }

      const minTick = alignTick(MAX_TICK_RANGE.lower, tickSpacing)
      const maxTick = alignTick(MAX_TICK_RANGE.upper, tickSpacing)
      const isAtLimit = inverted
        ? (bound === 'min' && tick >= maxTick) ||
          (bound === 'max' && tick <= minTick)
        : (bound === 'min' && tick <= minTick) ||
          (bound === 'max' && tick >= maxTick)

      if (isAtLimit) {
        return bound === 'min' ? '0' : '∞'
      }

      const rawPrice = calculatePriceFromTick(tick)
      const humanPrice = rawPrice * 10 ** (token0.decimals - token1.decimals)
      const displayPrice = inverted ? 1 / humanPrice : humanPrice

      return Number.isFinite(displayPrice) && displayPrice > 0
        ? Number.parseFloat(displayPrice.toPrecision(5)).toString()
        : bound === 'min'
          ? '0'
          : '∞'
    },
    [inverted, tickSpacing, token0, token1],
  )

  const displayPrice = useCallback(
    (bound: PriceRangeBound): string => formatTick(displayTick(bound), bound),
    [displayTick, formatTick],
  )

  const setDisplayTick = useCallback(
    (bound: PriceRangeBound, value: SetStateAction<number>): void => {
      const setter: Dispatch<SetStateAction<number>> =
        (bound === 'min') === inverted ? setTickUpper : setTickLower
      setter(value)
    },
    [inverted, setTickLower, setTickUpper],
  )

  const commitPrice = useCallback(
    (bound: PriceRangeBound, value: string): void => {
      if (!token0 || !token1) {
        return
      }

      const trimmed = value.trim()
      const minTick = alignTick(MAX_TICK_RANGE.lower, tickSpacing)
      const maxTick = alignTick(MAX_TICK_RANGE.upper, tickSpacing)
      const parsedPrice = Price.tryFromHuman(
        inverted ? token1 : token0,
        inverted ? token0 : token1,
        trimmed,
      )
      const canonicalPrice = inverted ? parsedPrice?.invert() : parsedPrice
      const rawPrice = canonicalPrice?.asFraction.toNumber()
      let tick: number | undefined
      if (trimmed === '0') {
        tick = inverted ? maxTick : minTick
      } else if (trimmed === '∞' || trimmed === 'Infinity') {
        tick = inverted ? minTick : maxTick
      } else if (rawPrice && Number.isFinite(rawPrice) && rawPrice > 0) {
        tick = alignTick(calculateTickFromPrice(rawPrice), tickSpacing)
      }

      if (tick !== undefined) {
        setIsDynamic(false)
        setDisplayTick(bound, tick)
      }
    },
    [inverted, setDisplayTick, setIsDynamic, tickSpacing, token0, token1],
  )

  const stepPrice = useCallback(
    (bound: PriceRangeBound, direction: -1 | 1): void => {
      setIsDynamic(false)
      const tickDelta = direction * tickSpacing * (inverted ? -1 : 1)
      setDisplayTick(bound, (tick) => alignTick(tick + tickDelta, tickSpacing))
    },
    [inverted, setDisplayTick, setIsDynamic, tickSpacing],
  )

  const priceUnit =
    token0 && token1
      ? inverted
        ? `${token0.symbol} per ${token1.symbol}`
        : `${token1.symbol} per ${token0.symbol}`
      : ''

  if (variant === 'cards') {
    return (
      <div className="flex flex-col gap-3">
        <PresetSelector
          presets={presets}
          activePreset={activePreset}
          onSelect={(preset) => applyPresetRange(preset.lower, preset.upper)}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <PriceBlock
            id="min-price"
            label="Min Price"
            unit={priceUnit}
            value={displayPrice('min')}
            onUserInput={(value) => commitPrice('min', value)}
            decrement={() => stepPrice('min', -1)}
            increment={() => stepPrice('min', 1)}
          />
          <PriceBlock
            id="max-price"
            label="Max Price"
            unit={priceUnit}
            value={displayPrice('max')}
            onUserInput={(value) => commitPrice('max', value)}
            decrement={() => stepPrice('max', -1)}
            increment={() => stepPrice('max', 1)}
          />
        </div>
      </div>
    )
  }

  return (
    <DefaultTickRangeSelector
      tickLower={tickLower}
      tickUpper={tickUpper}
      isTickRangeValid={isTickRangeValid}
      currentPrice={formatTick(currentTick, 'min')}
      priceUnit={priceUnit}
      presets={presets}
      activePreset={activePreset}
      displayPrice={displayPrice}
      commitPrice={commitPrice}
      stepPrice={stepPrice}
      applyPresetRange={applyPresetRange}
    />
  )
}

interface PresetSelectorProps {
  presets: PriceRangePreset[]
  activePreset: PriceRangePreset | undefined
  onSelect(preset: PriceRangePreset): void
}

function PresetSelector({
  presets,
  activePreset,
  onSelect,
}: PresetSelectorProps): ReactElement {
  return (
    <RadioGroup
      value={activePreset?.label ?? ''}
      className="flex flex-wrap gap-2"
    >
      {presets.map((preset) => (
        <Radio
          key={preset.label}
          value={preset.label}
          as={Toggle}
          size="sm"
          variant="outline"
          className="whitespace-nowrap"
          pressed={activePreset?.label === preset.label}
          onClick={() => onSelect(preset)}
        >
          {preset.label}
        </Radio>
      ))}
    </RadioGroup>
  )
}

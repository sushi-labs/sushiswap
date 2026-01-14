'use client'

import { Button } from '@sushiswap/ui'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { TickRangeSelectorState } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import {
  calculatePriceFromTick,
  calculateTickFromPrice,
} from '~stellar/_common/lib/soroban'
import type { Token } from '~stellar/_common/lib/types/token.type'
import {
  MAX_TICK_RANGE,
  alignTick,
  clampTickRange,
} from '~stellar/_common/lib/utils/ticks'

interface TickRangeSelectorProps {
  params: TickRangeSelectorState
  token0?: Token
  token1?: Token
}

type PriceRangePreset = {
  label: string
  lower: number
  upper: number
}[]

/**
 * Format price for display, handling edge cases for min/max bounds
 */
function formatPriceDisplay(
  tick: number,
  tickSpacing: number,
  bound: 'lower' | 'upper',
): string {
  // Check if tick is at or beyond extremes
  if (
    bound === 'lower' &&
    tick <= alignTick(MAX_TICK_RANGE.lower, tickSpacing)
  ) {
    return '0'
  }
  if (
    bound === 'upper' &&
    tick >= alignTick(MAX_TICK_RANGE.upper, tickSpacing)
  ) {
    return '∞'
  }

  const price = calculatePriceFromTick(tick)

  if (!Number.isFinite(price) || price <= 0) {
    return bound === 'lower' ? '0' : '∞'
  }

  // Format based on price magnitude
  if (price >= 1_000_000) {
    return price.toExponential(4)
  }
  if (price < 0.0001) {
    return price.toExponential(4)
  }

  // Use appropriate precision
  if (price >= 1000) {
    return price.toFixed(2)
  }
  if (price >= 1) {
    return price.toFixed(4)
  }
  return price.toFixed(6)
}

/**
 * Parse price input and convert to tick, clamped to valid range
 */
function priceToClampedTick(
  priceStr: string,
  tickSpacing: number,
): number | null {
  const price = Number.parseFloat(priceStr)
  if (Number.isNaN(price) || price <= 0) {
    return null
  }

  const tick = calculateTickFromPrice(price)
  return alignTick(tick, tickSpacing)
}

export const TickRangeSelector: React.FC<TickRangeSelectorProps> = ({
  params,
  token0,
  token1,
}) => {
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

  const maxTickRange = clampTickRange(
    MAX_TICK_RANGE.lower,
    MAX_TICK_RANGE.upper,
    tickSpacing,
  )

  // Local state for price inputs (allows user to type freely)
  const [minPriceRawInput, setMinPriceRawInput] = useState(
    formatPriceDisplay(tickLower, tickSpacing, 'lower'),
  )
  const [maxPriceRawInput, setMaxPriceRawInput] = useState(
    formatPriceDisplay(tickUpper, tickSpacing, 'upper'),
  )

  // percentFraction represents the decimal form (e.g. 0.1 for 10%).
  const createPercentPreset = useCallback(
    (label: string, percentFraction: number) => {
      const upperMultiplier = 1 + percentFraction
      const lowerMultiplier = 1 / upperMultiplier
      const { lower, upper } = clampTickRange(
        currentTick + calculateTickFromPrice(lowerMultiplier),
        currentTick + calculateTickFromPrice(upperMultiplier),
        tickSpacing,
      )

      return {
        label,
        lower,
        upper,
      }
    },
    [currentTick, tickSpacing],
  )

  const priceRangePresets: PriceRangePreset = useMemo(
    () => [
      {
        label: 'Full Range',
        lower: maxTickRange.lower,
        upper: maxTickRange.upper,
      },
      createPercentPreset('×÷2', 1), // 2x / 0.5x
      createPercentPreset('×÷1.2', 0.2), // 1.2x / 0.833x
      createPercentPreset('×÷1.01', 0.01), // 1.01x / 0.99x
    ],
    [maxTickRange.lower, maxTickRange.upper, createPercentPreset],
  )

  // Sync local inputs when ticks change externally
  useEffect(() => {
    setMinPriceRawInput(formatPriceDisplay(tickLower, tickSpacing, 'lower'))
  }, [tickLower, tickSpacing])

  useEffect(() => {
    setMaxPriceRawInput(formatPriceDisplay(tickUpper, tickSpacing, 'upper'))
  }, [tickUpper, tickSpacing])

  // Handle min price input change
  const handleMinPriceBlur = useCallback(() => {
    const newTick = priceToClampedTick(minPriceRawInput, tickSpacing)
    if (newTick !== null) {
      setIsDynamic(false)
      setTickLower(newTick)
    } else {
      // Reset to current value if invalid
      setMinPriceRawInput(formatPriceDisplay(tickLower, tickSpacing, 'lower'))
    }
  }, [minPriceRawInput, tickSpacing, setIsDynamic, setTickLower, tickLower])

  // Handle max price input change
  const handleMaxPriceBlur = useCallback(() => {
    const newTick = priceToClampedTick(maxPriceRawInput, tickSpacing)
    if (newTick !== null) {
      setIsDynamic(false)
      setTickUpper(newTick)
    } else {
      // Reset to current value if invalid
      setMaxPriceRawInput(formatPriceDisplay(tickUpper, tickSpacing, 'upper'))
    }
  }, [maxPriceRawInput, tickSpacing, setIsDynamic, setTickUpper, tickUpper])

  // Decrement/increment handlers for price (moves by one tick spacing)
  const decrementMinPrice = useCallback(() => {
    setIsDynamic(false)
    setTickLower((prev) => alignTick(prev - tickSpacing, tickSpacing))
  }, [setIsDynamic, setTickLower, tickSpacing])

  const incrementMinPrice = useCallback(() => {
    setIsDynamic(false)
    setTickLower((prev) => alignTick(prev + tickSpacing, tickSpacing))
  }, [setIsDynamic, setTickLower, tickSpacing])

  const decrementMaxPrice = useCallback(() => {
    setIsDynamic(false)
    setTickUpper((prev) => alignTick(prev - tickSpacing, tickSpacing))
  }, [setIsDynamic, setTickUpper, tickSpacing])

  const incrementMaxPrice = useCallback(() => {
    setIsDynamic(false)
    setTickUpper((prev) => alignTick(prev + tickSpacing, tickSpacing))
  }, [setIsDynamic, setTickUpper, tickSpacing])

  const priceUnit = token0 && token1 ? `${token1.code} per ${token0.code}` : ''

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Price Range</span>
        {token0 && token1 && (
          <span className="text-xs text-muted-foreground">
            {calculatePriceFromTick(currentTick).toPrecision(4)} {priceUnit}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {priceRangePresets.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            size="sm"
            variant={
              isDynamic &&
              dynamicOffsets !== null &&
              dynamicOffsets.lower === preset.lower - currentTick &&
              dynamicOffsets.upper === preset.upper - currentTick
                ? 'default'
                : 'secondary'
            }
            onClick={() => {
              applyPresetRange(preset.lower, preset.upper)
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Min Price</div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={decrementMinPrice}
              className="w-10 px-0"
            >
              -
            </Button>
            <input
              type="text"
              inputMode="decimal"
              value={minPriceRawInput}
              onChange={(e) => setMinPriceRawInput(e.target.value)}
              onBlur={handleMinPriceBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMinPriceBlur()
                  e.currentTarget.blur()
                }
              }}
              placeholder="0.0"
              className="w-full text-center font-mono !outline-none !ring-0 border-0 flex items-center px-3 rounded-lg font-medium bg-secondary group-hover:bg-muted group-focus:bg-accent"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={incrementMinPrice}
              className="w-10 px-0"
            >
              +
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Max Price</div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={decrementMaxPrice}
              className="w-10 px-0"
            >
              -
            </Button>
            <input
              type="text"
              inputMode="decimal"
              value={maxPriceRawInput}
              onChange={(e) => setMaxPriceRawInput(e.target.value)}
              onBlur={handleMaxPriceBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMaxPriceBlur()
                  e.currentTarget.blur()
                }
              }}
              placeholder="0.0"
              className="w-full text-center font-mono !outline-none !ring-0 border-0 flex items-center px-3 rounded-lg font-medium bg-secondary group-hover:bg-muted group-focus:bg-accent"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={incrementMaxPrice}
              className="w-10 px-0"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`p-3 border rounded-lg ${
          isTickRangeValid
            ? 'bg-blue-500/5 border-blue-500/20'
            : 'bg-yellow-500/10 border-yellow-500/20'
        }`}
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Selected Range:</span>
          <div className="flex flex-col justify-end text-end">
            {token0 && token1 && (
              <div className="font-mono font-semibold">
                {formatPriceDisplay(tickLower, tickSpacing, 'lower')} -{' '}
                {formatPriceDisplay(tickUpper, tickSpacing, 'upper')}{' '}
                {token1.code}/{token0.code}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Ticks: {tickLower} to {tickUpper}
            </div>
          </div>
        </div>
        {!isTickRangeValid && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
            ⚠️ Min price must be less than max price.
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Enter your desired price range. Prices are automatically adjusted to
          valid tick boundaries.
        </p>
      </div>
    </div>
  )
}

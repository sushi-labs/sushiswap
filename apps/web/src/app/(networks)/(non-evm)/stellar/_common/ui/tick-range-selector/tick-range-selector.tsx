'use client'

import { Button } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { PriceBlock } from 'src/lib/components/price-block'
import type { StellarToken } from 'sushi/stellar'
import type { TickRangeSelectorState } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import {
  parseStartingPrice,
  poolPrice,
} from '~stellar/_common/lib/utils/liquidity-amounts'
import {
  MAX_TICK_RANGE,
  alignTick,
  clampTickRange,
  getSqrtRatioAtTick,
  getTickAtSqrtRatio,
} from '~stellar/_common/lib/utils/ticks'

interface TickRangeSelectorProps {
  params: TickRangeSelectorState
  token0?: StellarToken
  token1?: StellarToken
  inverted?: boolean
  variant?: 'default' | 'cards'
}

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
    setIsDynamic,
    applyPresetRange,
  } = params
  const limits = clampTickRange(
    MAX_TICK_RANGE.lower,
    MAX_TICK_RANGE.upper,
    tickSpacing,
  )
  const presets = [
    { label: 'Full Range', ...limits },
    ...[2, 1.2, 1.01].map((factor) => {
      // Even the narrowest preset needs a usable tick on each side.
      const offset = Math.max(tickSpacing, Math.log(factor) / Math.log(1.0001))
      return {
        label: `×÷${factor}`,
        ...clampTickRange(
          currentTick - offset,
          currentTick + offset,
          tickSpacing,
        ),
      }
    }),
  ]
  function display(tick: number): string {
    if (!token0 || !token1) return ''
    return poolPrice(
      token0,
      token1,
      getSqrtRatioAtTick(tick),
      inverted,
    ).toSignificant(8)
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" aria-label="Price range presets">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            size="sm"
            variant={
              tickLower === preset.lower && tickUpper === preset.upper
                ? 'default'
                : 'secondary'
            }
            aria-pressed={
              tickLower === preset.lower && tickUpper === preset.upper
            }
            onClick={() => applyPresetRange(preset.lower, preset.upper)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div
        className={
          variant === 'cards' ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-3'
        }
      >
        {(['min', 'max'] as const).map((bound) => {
          const isLower = (bound === 'min') !== inverted
          const tick = isLower ? tickLower : tickUpper
          const setTick = isLower ? setTickLower : setTickUpper
          const atLimit = isLower
            ? tick === limits.lower
            : tick === limits.upper
          function setValue(value: string): void {
            if (!token0 || !token1) return
            let next: number
            if (bound === 'min' && value === '0')
              next = inverted ? limits.upper : limits.lower
            else if (bound === 'max' && value === '∞')
              next = inverted ? limits.lower : limits.upper
            else {
              const price = parseStartingPrice(token0, token1, value, inverted)
              if (price === undefined) return
              next = alignTick(getTickAtSqrtRatio(price), tickSpacing)
            }
            setIsDynamic(false)
            setTick(next)
          }
          function step(direction: number): undefined {
            setIsDynamic(false)
            setTick(
              alignTick(
                tick + direction * (inverted ? -1 : 1) * tickSpacing,
                tickSpacing,
              ),
            )
          }
          return (
            <PriceBlock
              key={`${bound}-${inverted}`}
              id={`stellar-${bound}-price`}
              label={bound === 'min' ? 'Min Price' : 'Max Price'}
              token0={inverted ? token1 : token0}
              token1={inverted ? token0 : token1}
              value={atLimit ? (bound === 'min' ? '0' : '∞') : display(tick)}
              onUserInput={setValue}
              decrement={() => step(-1)}
              increment={() => step(1)}
              decrementDisabled={
                inverted ? tick >= limits.upper : tick <= limits.lower
              }
              incrementDisabled={
                inverted ? tick <= limits.lower : tick >= limits.upper
              }
              locked={!token0 || !token1}
            />
          )
        })}
      </div>
      {!isTickRangeValid && (
        <p role="alert" className="text-sm text-red">
          Min price must be less than max price.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Prices are adjusted to the nearest supported price increment.
      </p>
    </div>
  )
}

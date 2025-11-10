'use client'

import { Button, TextField } from '@sushiswap/ui'
import type React from 'react'
import { useEffect, useState } from 'react'
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

type TickRangePreset = {
  label: string
  lower: number
  upper: number
}[]

export const TickRangeSelector: React.FC<TickRangeSelectorProps> = ({
  params,
  token0,
  token1,
}) => {
  const {
    currentTick,
    tickLower,
    tickUpper,
    ticksAligned,
    tickSpacing,
    isTickRangeValid,
    defaultLower,
    defaultUpper,
    setTickLower,
    setTickUpper,
  } = params

  const maxTickRange = clampTickRange(
    MAX_TICK_RANGE.lower,
    MAX_TICK_RANGE.upper,
    tickSpacing,
  )

  const [minTickRawInput, setMinTickRawInput] = useState(tickLower.toString())
  const [maxTickRawInput, setMaxTickRawInput] = useState(tickUpper.toString())

  const tickRangePresets: TickRangePreset = [
    {
      label: 'Default',
      lower: defaultLower,
      upper: defaultUpper,
    },
    {
      label: 'Full Range',
      lower: maxTickRange.lower,
      upper: maxTickRange.upper,
    },
    {
      label: '±10%',
      lower: alignTick(currentTick + calculateTickFromPrice(0.9), tickSpacing),
      upper: alignTick(currentTick + calculateTickFromPrice(1.1), tickSpacing),
    },
    {
      label: '±1%',
      lower: alignTick(currentTick + calculateTickFromPrice(0.99), tickSpacing),
      upper: alignTick(currentTick + calculateTickFromPrice(1.01), tickSpacing),
    },
  ]

  useEffect(() => {
    setMinTickRawInput(tickLower.toString())
  }, [tickLower])

  useEffect(() => {
    setMaxTickRawInput(tickUpper.toString())
  }, [tickUpper])

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Price Range Strategy</span>
        <span className="text-xs text-muted-foreground">
          Multiples of {tickSpacing}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {tickRangePresets.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            size="sm"
            variant={
              tickLower === preset.lower && tickUpper === preset.upper
                ? 'default'
                : 'secondary'
            }
            onClick={() => {
              setTickLower(preset.lower)
              setTickUpper(preset.upper)
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Min Tick</div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setTickLower((prev) => {
                  return alignTick(prev - tickSpacing, tickSpacing)
                })
              }}
              className="w-10 px-0"
            >
              -
            </Button>
            <input
              type="number"
              value={minTickRawInput}
              onChange={(e) => {
                setMinTickRawInput(e.target.value)
              }}
              onBlur={(event) => {
                const raw = Number.parseInt(event.target.value, 10)
                if (Number.isNaN(raw)) {
                  return
                }
                setTickLower(alignTick(raw, tickSpacing))
              }}
              step={tickSpacing}
              className="w-full text-center font-mono !outline-none !ring-0 border-0 flex items-center px-3 rounded-lg font-medium bg-secondary group-hover:bg-muted group-focus:bg-accent"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                setTickLower((prev) =>
                  alignTick(prev + tickSpacing, tickSpacing),
                )
              }
              className="w-10 px-0"
            >
              +
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Max Tick</div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                setTickUpper((prev) =>
                  alignTick(prev - tickSpacing, tickSpacing),
                )
              }
              className="w-10 px-0"
            >
              -
            </Button>
            <input
              type="number"
              value={maxTickRawInput}
              onChange={(e) => {
                setMaxTickRawInput(e.target.value)
              }}
              onBlur={(event) => {
                const raw = Number.parseInt(event.target.value, 10)
                if (Number.isNaN(raw)) {
                  return
                }
                setTickUpper(alignTick(raw, tickSpacing))
              }}
              step={tickSpacing}
              className="w-full text-center font-mono !outline-none !ring-0 border-0 flex items-center px-3 rounded-lg font-medium bg-secondary group-hover:bg-muted group-focus:bg-accent"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                setTickUpper((prev) =>
                  alignTick(prev + tickSpacing, tickSpacing),
                )
              }
              className="w-10 px-0"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`p-3 border rounded-lg ${
          ticksAligned
            ? 'bg-blue-500/5 border-blue-500/20'
            : 'bg-yellow-500/10 border-yellow-500/20'
        }`}
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current Range:</span>
          <div className="flex flex-col justify-end text-end">
            <div className="font-mono font-semibold">
              {tickLower} to {tickUpper}
            </div>
            {token0 && token1 && (
              <div className="text-xs text-muted-foreground">
                {`${(calculatePriceFromTick(tickLower)).toFixed(4)} - ${(calculatePriceFromTick(tickUpper)).toFixed(4)} ${token1.code} / ${token0.code}`}
              </div>
            )}
          </div>
        </div>
        {ticksAligned ? (
          <p className="text-xs text-muted-foreground mt-2">
            Ticks must be multiples of {tickSpacing}. Type any value and it will
            auto-align to the nearest valid tick.
          </p>
        ) : (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
            ⚠️ Ticks must be multiples of {tickSpacing}. Click outside the input
            to auto-align.
          </p>
        )}
        {!isTickRangeValid && ticksAligned && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
            Tick lower must be less than tick upper.
          </p>
        )}
      </div>
    </div>
  )
}

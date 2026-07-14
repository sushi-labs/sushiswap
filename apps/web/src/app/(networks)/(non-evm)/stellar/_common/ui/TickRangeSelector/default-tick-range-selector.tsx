import { Button, classNames } from '@sushiswap/ui'
import { type ReactElement, useEffect, useState } from 'react'
import type { PriceRangeBound, PriceRangePreset } from './TickRangeSelector'

interface DefaultTickRangeSelectorProps {
  tickLower: number
  tickUpper: number
  isTickRangeValid: boolean
  currentPrice: string
  priceUnit: string
  presets: PriceRangePreset[]
  activePreset: PriceRangePreset | undefined
  displayPrice(bound: PriceRangeBound): string
  commitPrice(bound: PriceRangeBound, value: string): void
  stepPrice(bound: PriceRangeBound, direction: -1 | 1): void
  applyPresetRange(lower: number, upper: number): void
}

export function DefaultTickRangeSelector({
  tickLower,
  tickUpper,
  isTickRangeValid,
  currentPrice,
  priceUnit,
  presets,
  activePreset,
  displayPrice,
  commitPrice,
  stepPrice,
  applyPresetRange,
}: DefaultTickRangeSelectorProps): ReactElement {
  const minPrice = displayPrice('min')
  const maxPrice = displayPrice('max')
  const [minInput, setMinInput] = useState(minPrice)
  const [maxInput, setMaxInput] = useState(maxPrice)

  useEffect(() => setMinInput(minPrice), [minPrice])
  useEffect(() => setMaxInput(maxPrice), [maxPrice])

  function handleBlur(bound: PriceRangeBound, value: string): void {
    commitPrice(bound, value)
    if (bound === 'min') {
      setMinInput(displayPrice('min'))
    } else {
      setMaxInput(displayPrice('max'))
    }
  }

  return (
    <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-800">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Price Range</span>
        {currentPrice ? (
          <span className="text-xs text-muted-foreground">
            {currentPrice} {priceUnit}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            size="sm"
            variant={
              activePreset?.label === preset.label ? 'default' : 'secondary'
            }
            onClick={() => applyPresetRange(preset.lower, preset.upper)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DefaultPriceInput
          label="Min Price"
          value={minInput}
          onChange={setMinInput}
          onBlur={() => handleBlur('min', minInput)}
          decrement={() => stepPrice('min', -1)}
          increment={() => stepPrice('min', 1)}
        />
        <DefaultPriceInput
          label="Max Price"
          value={maxInput}
          onChange={setMaxInput}
          onBlur={() => handleBlur('max', maxInput)}
          decrement={() => stepPrice('max', -1)}
          increment={() => stepPrice('max', 1)}
        />
      </div>

      <div
        className={classNames(
          'rounded-lg border p-3',
          isTickRangeValid
            ? 'border-blue-500/20 bg-blue-500/5'
            : 'border-yellow-500/20 bg-yellow-500/10',
        )}
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Selected Range:</span>
          <div className="flex flex-col justify-end text-end">
            {minPrice && maxPrice ? (
              <div className="font-mono font-semibold">
                {minPrice} - {maxPrice} {priceUnit}
              </div>
            ) : null}
            <div className="text-xs text-muted-foreground">
              Ticks: {tickLower} to {tickUpper}
            </div>
          </div>
        </div>
        {!isTickRangeValid ? (
          <p className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
            Min price must be less than max price.
          </p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          Enter your desired price range. Prices are automatically adjusted to
          valid tick boundaries.
        </p>
      </div>
    </div>
  )
}

interface DefaultPriceInputProps {
  label: string
  value: string
  onChange(value: string): void
  onBlur(): void
  decrement(): void
  increment(): void
}

function DefaultPriceInput({
  label,
  value,
  onChange,
  onBlur,
  decrement,
  increment,
}: DefaultPriceInputProps): ReactElement {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={decrement}
          className="w-10 px-0"
        >
          -
        </Button>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur()
            }
          }}
          placeholder="0.0"
          className="flex w-full items-center rounded-lg border-0 bg-secondary px-3 text-center font-mono font-medium !outline-none !ring-0 group-hover:bg-muted group-focus:bg-accent"
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={increment}
          className="w-10 px-0"
        >
          +
        </Button>
      </div>
    </div>
  )
}

'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import {
  Explainer,
  Label,
  TextField,
  TextFieldDescription,
  Toggle,
} from '@sushiswap/ui'
import { type ReactElement, type ReactNode, useMemo } from 'react'
import { PriceBlock } from 'src/lib/components/price-block'
import { Bound } from 'src/lib/constants'
import type { PriceRange } from 'src/lib/pool/cl'
import type { Price } from 'sushi'
import {
  type EvmCurrency,
  getCapitalEfficiency,
  getTokenRatio,
} from 'sushi/evm'
import type { ConcentratedRange } from '../concentrated-liquidity-provider/use-concentrated-range'
import type { RangeInput } from '../concentrated-liquidity-provider/use-range-input'

/**
 * The range as displayed, in prices of currencyA: with `invertPrice`, the
 * min is the upper tick's price inverted.
 */
function getDisplayedRange<TCurrency extends EvmCurrency>(
  pricesAtTicks: ConcentratedRange<TCurrency>['pricesAtTicks'],
  ticksAtLimit: ConcentratedRange<TCurrency>['ticksAtLimit'],
  invertPrice: boolean,
): {
  minPrice: Price<TCurrency, TCurrency> | undefined
  maxPrice: Price<TCurrency, TCurrency> | undefined
  minAtLimit: boolean
  maxAtLimit: boolean
} {
  const { [Bound.LOWER]: lower, [Bound.UPPER]: upper } = pricesAtTicks
  return {
    minPrice: invertPrice ? upper?.invert() : lower,
    maxPrice: invertPrice ? lower?.invert() : upper,
    minAtLimit: Boolean(ticksAtLimit[invertPrice ? Bound.UPPER : Bound.LOWER]),
    maxAtLimit: Boolean(ticksAtLimit[invertPrice ? Bound.LOWER : Bound.UPPER]),
  }
}

/**
 * The value split of a position in the range at `price`, as of currencyA
 * then currencyB, and its capital efficiency against full range.
 */
export function useRangeRatio<TCurrency extends EvmCurrency>(
  price: Price<TCurrency, TCurrency> | undefined,
  pricesAtTicks: ConcentratedRange<TCurrency>['pricesAtTicks'],
  invertPrice: boolean,
): {
  valueRatio: [number, number] | undefined
  capitalEfficiency: number | undefined
} {
  const { [Bound.LOWER]: lower, [Bound.UPPER]: upper } = pricesAtTicks
  return useMemo(() => {
    if (!price || !lower || !upper)
      return { valueRatio: undefined, capitalEfficiency: undefined }
    const [ratio0, ratio1] = getTokenRatio(price, lower, upper)
    const efficiency = getCapitalEfficiency(price, lower, upper)
    return {
      valueRatio: invertPrice ? [ratio1, ratio0] : [ratio0, ratio1],
      capitalEfficiency:
        Number.isFinite(efficiency) && efficiency > 0 ? efficiency : undefined,
    }
  }, [price, lower, upper, invertPrice])
}

/**
 * The form's currencies in pool order; the pressed one is the displayed base,
 * currencyA.
 */
export function RangeTokenToggle({
  currencyA,
  currencyB,
  invertPrice,
  onSwitch,
}: {
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  invertPrice: boolean
  onSwitch(): void
}): ReactElement {
  const ordered = invertPrice ? [currencyB, currencyA] : [currencyA, currencyB]
  return (
    <div className="flex gap-1">
      {ordered.map((currency, i) => (
        <Toggle
          key={currency?.id ?? i}
          variant="outline"
          onPressedChange={(pressed) => pressed && onSwitch()}
          pressed={invertPrice === (i === 1)}
          size="sm"
        >
          {currency?.symbol}
        </Toggle>
      ))}
    </div>
  )
}

/** The start price of a pool to create, of currencyA in currencyB. */
export function StartPriceInput({
  currencyA,
  currencyB,
  value,
  onChange,
}: {
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  value: string
  onChange(value: string): void
}): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <Label>Start price</Label>
      <TextField
        variant="outline"
        value={value}
        onValueChange={onChange}
        testdata-id="start-price-input"
        type="number"
        unit={`${currencyB?.symbol} per ${currencyA?.symbol}`}
      />
      <TextFieldDescription>
        Your pool needs a starting price somewhere between the min. and max.
        price
      </TextFieldDescription>
    </div>
  )
}

/** The range presets; pressing the selected one calls `onDeselect`. */
export function RangePresetToggles({
  options,
  range,
  onDeselect,
  disabled,
}: {
  options: readonly { label: string; value: PriceRange }[]
  range: RangeInput
  onDeselect(): void
  disabled?: boolean
}): ReactElement {
  return (
    <RadioGroup value={range.preset ?? ''} className="flex flex-wrap gap-2">
      {options.map(({ value, label }) => (
        <Radio value={value} key={value}>
          <Toggle
            disabled={disabled}
            size="sm"
            variant="outline"
            className="whitespace-nowrap"
            pressed={range.preset === value}
            onClick={() =>
              range.preset === value ? onDeselect() : range.applyPreset(value)
            }
          >
            {label}
          </Toggle>
        </Radio>
      ))}
    </RadioGroup>
  )
}

/** A token ratio or capital efficiency row of the range summary. */
export function RangeStat({
  label,
  explainer,
  children,
}: {
  label: ReactNode
  explainer: ReactNode
  children: ReactNode
}): ReactElement {
  return (
    <div className="flex flex-wrap items-start justify-between gap-1 flex-col sm:flex-row sm:items-center">
      <span>
        <span className="mr-1">{label}</span>
        <Explainer iconProps={{ className: 'inline mb-0.5' }}>
          {explainer}
        </Explainer>
      </span>
      <div className="flex flex-grow gap-1 items-center justify-end">
        {children}
      </div>
    </div>
  )
}

/** The min and max price inputs, in prices of currencyA. */
export function RangePriceInputs<TCurrency extends EvmCurrency>({
  currencyA,
  currencyB,
  pricesAtTicks,
  ticksAtLimit,
  invertPrice,
  range,
}: Pick<ConcentratedRange<TCurrency>, 'pricesAtTicks' | 'ticksAtLimit'> & {
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  invertPrice: boolean
  range: RangeInput
}): ReactElement {
  const { minPrice, maxPrice, minAtLimit, maxAtLimit } = getDisplayedRange(
    pricesAtTicks,
    ticksAtLimit,
    invertPrice,
  )
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <PriceBlock
        id="min-price"
        token0={currencyA}
        token1={currencyB}
        label="Min Price"
        value={minAtLimit ? '0' : (minPrice?.toSignificant(5) ?? '')}
        onUserInput={range.setMinPrice}
        decrement={() => range.stepMin(-1)}
        increment={() => range.stepMin(1)}
        decrementDisabled={minAtLimit}
      />
      <PriceBlock
        id="max-price"
        token0={currencyA}
        token1={currencyB}
        label="Max Price"
        value={maxAtLimit ? '∞' : (maxPrice?.toSignificant(5) ?? '')}
        onUserInput={range.setMaxPrice}
        decrement={() => range.stepMax(-1)}
        increment={() => range.stepMax(1)}
        incrementDisabled={maxAtLimit}
      />
    </div>
  )
}

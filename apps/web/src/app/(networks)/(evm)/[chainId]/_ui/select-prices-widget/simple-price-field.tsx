'use client'

import { Label, TextField, TextFieldDescription } from '@sushiswap/ui'
import { type ComponentProps, type ReactElement, useState } from 'react'
import { PriceBlock } from 'src/lib/components/price-block'
import { withoutScientificNotation } from 'sushi'
import {
  type PriceDisplayUnits,
  toDisplayPrice,
  toPairPrice,
} from './price-units'

type Props = Pick<
  ComponentProps<typeof PriceBlock>,
  | 'id'
  | 'label'
  | 'token0'
  | 'token1'
  | 'locked'
  | 'decrementDisabled'
  | 'incrementDisabled'
> & {
  value: string
  units: PriceDisplayUnits
  unit: string
  limitValue?: '0' | '∞'
  onCommit(value: string): void
  steps?: {
    decrement(): string | undefined
    increment(): string | undefined
  }
}

export function SimplePriceField({
  value,
  units,
  unit,
  limitValue,
  onCommit,
  steps,
  ...props
}: Props): ReactElement {
  const [draft, setDraft] = useState<string>()
  const [error, setError] = useState(false)
  const [editingUsdPrice, setEditingUsdPrice] = useState<number>()
  // A quote update during an edit must not change the meaning of that edit.
  // Once committed, the field resumes displaying the latest USD equivalent.
  const editUnits = {
    ...units,
    usdPrice: editingUsdPrice ?? units.usdPrice,
  }
  const displayValue = limitValue ?? toDisplayPrice(value, editUnits)

  function commit(input: string): void {
    const pairValue = toPairPrice(input, editUnits)
    setError(input !== '' && pairValue === '')
    // Clear an invalid input so a previous valid range cannot be submitted.
    onCommit(pairValue)
  }

  function step(callback: () => string | undefined): string | undefined {
    const next = callback()
    return next === undefined
      ? undefined
      : toDisplayPrice(withoutScientificNotation(next) ?? '', editUnits)
  }

  return (
    <div
      className="flex flex-col gap-2 min-w-0 flex-1"
      onFocusCapture={() => setEditingUsdPrice(units.usdPrice)}
      onBlur={() => setEditingUsdPrice(undefined)}
    >
      {steps ? (
        <PriceBlock
          {...props}
          labelClassName="!text-sm !leading-5"
          unit={unit}
          unitClassName="!text-xs leading-5"
          value={displayValue}
          onUserInput={commit}
          decrement={() => step(steps.decrement)}
          increment={() => step(steps.increment)}
        />
      ) : (
        <>
          <Label htmlFor={props.id} className="!font-semibold !leading-5">
            {props.label}
          </Label>
          <TextField
            id={props.id}
            testdata-id={`${props.id}-input`}
            variant="outline"
            type="number"
            inputMode="decimal"
            unit={unit}
            value={draft ?? displayValue}
            disabled={props.locked}
            onValueChange={setDraft}
            onBlur={() => {
              if (draft !== undefined && draft !== displayValue) commit(draft)
              setDraft(undefined)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
          />
        </>
      )}
      {error && (
        <TextFieldDescription
          role="alert"
          className="!text-xs leading-5 text-red"
        >
          Enter a valid price greater than zero.
        </TextFieldDescription>
      )}
    </div>
  )
}

'use client'
import { Slider, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'

export const ConfigureAmount = ({
  value,
  onChange,
  maxValue,
  disabled,
  step,
  coinSymbol,
  maxDecimals,
}: {
  value: number
  onChange: (value: number) => void
  maxValue: number
  disabled?: boolean
  step: number
  coinSymbol: string
  maxDecimals: number
}) => {
  const [pending, startTransition] = useTransition()

  const [localValue, setLocalValue] = useState<string>('')

  const _onChange = useCallback(
    (value: string) => {
      const _val = value
      const max = maxValue
      if (Number(_val) > max) {
        setLocalValue(max.toString())
        startTransition(() => {
          onChange(max)
        })
      } else {
        setLocalValue(_val)
        startTransition(() => {
          onChange(Number(_val))
        })
      }
    },
    [onChange, maxValue],
  )
  return (
    <div className="flex items-center gap-4">
      <Slider
        value={[value]}
        min={step}
        max={maxValue}
        step={step}
        onValueChange={(val: number[]) => {
          onChange(val[0])
        }}
        disabled={disabled}
        rangeClassName="!bg-blue"
        thumbClassName="!border-white"
      />
      <div
        className={classNames(
          'border flex items-center justify-center !rounded-md !border-accent py-0 px-2 whitespace-nowrap text-sm font-medium text-right',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          onValueChange={_onChange}
          value={pending ? localValue : value.toString()}
          maxDecimals={maxDecimals}
          disabled={true}
        />
        <p>{coinSymbol}</p>
      </div>
    </div>
  )
}

'use client'

import { Slider, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useEffect, useState } from 'react'

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
  const [localValue, setLocalValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString())
    }
  }, [value, isFocused])

  const handleTextChange = useCallback(
    (nextValue: string) => {
      const decimalRegex = new RegExp(`^(\\d+)?(\\.\\d{0,${maxDecimals}})?$`)

      if (!decimalRegex.test(nextValue)) return

      setLocalValue(nextValue)

      // Allow clearing, ".", ".5 in progress", "1.", etc.
      if (nextValue === '' || nextValue === '.' || nextValue.endsWith('.')) {
        return
      }

      const numericValue = Number(nextValue)

      if (Number.isNaN(numericValue)) return

      if (numericValue > maxValue) {
        setLocalValue(maxValue.toString())
        onChange(maxValue)
        return
      }

      onChange(numericValue)
    },
    [maxDecimals, maxValue, onChange],
  )
  const handleSliderChange = useCallback(
    (val: number[]) => {
      const nextValue = val[0]
      setLocalValue(nextValue.toString())
      onChange(nextValue)
    },
    [onChange],
  )

  return (
    <div className="flex items-center gap-4">
      <Slider
        value={[value]}
        min={step}
        max={maxValue}
        step={step}
        onValueChange={handleSliderChange}
        disabled={disabled}
        rangeClassName="!bg-blue"
        thumbClassName="!border-white"
      />

      <div
        className={classNames(
          'border flex items-center justify-center !rounded-md border-[#FFFFFF1A] bg-transparent py-0 px-2 whitespace-nowrap text-sm font-medium text-right',
        )}
      >
        <TextField
          type="text"
          inputMode="decimal"
          variant="naked"
          onValueChange={handleTextChange}
          value={localValue}
          maxDecimals={maxDecimals}
          disabled={disabled}
          wrapperClassName="max-h-[30px]"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)

            if (localValue === '' || localValue === '.') {
              setLocalValue(value.toString())
              return
            }

            const numericValue = Math.min(Number(localValue), maxValue)
            setLocalValue(numericValue.toString())
            onChange(numericValue)
          }}
        />

        <p className="text-perps-muted-50">{coinSymbol}</p>
      </div>
    </div>
  )
}

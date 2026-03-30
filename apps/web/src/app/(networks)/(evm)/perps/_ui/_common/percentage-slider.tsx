'use client'
import { Slider, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'

export const PercentageSlider = ({
  value,
  onChange,
  maxValue,
  disabled,
  unit = '%',
}: {
  value: number
  onChange: (value: number) => void
  maxValue?: number
  disabled?: boolean
  unit?: string
}) => {
  const [pending, startTransition] = useTransition()

  const [localValue, setLocalValue] = useState<string>('')

  const _onChange = useCallback(
    (value: string) => {
      //only allow integers 1-100
      const _val = value.replace(/\D/g, '')
      const max = maxValue ?? 100
      if (Number(_val) > max) {
        setLocalValue(max.toString())
        startTransition(() => {
          onChange(max)
        })
      } else if (Number(_val) < 1) {
        setLocalValue('1')
        startTransition(() => {
          onChange(1)
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
    <div className="flex items-center gap-4 ">
      <Slider
        value={[value]}
        min={1}
        max={maxValue ?? 100}
        step={1}
        onValueChange={(val: number[]) => {
          onChange(val[0])
        }}
        disabled={disabled}
        rangeClassName="!bg-blue"
        thumbClassName="!border-white"
      />
      <div
        className={classNames(
          'border max-w-[58px] min-w-[58px] flex items-center justify-center !rounded-md !border-[#FFFFFF1A] !bg-[#FFFFFF0D] py-0 px-2 whitespace-nowrap text-sm font-medium text-right',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          onValueChange={_onChange}
          value={pending ? localValue : value.toString()}
          maxDecimals={0}
          wrapperClassName="max-h-[30px]"
        />
        <p className="text-[#99A1AF]">{unit}</p>
      </div>
    </div>
  )
}

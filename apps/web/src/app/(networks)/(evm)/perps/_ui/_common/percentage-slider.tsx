'use client'
import { Slider, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'

export const PercentageSlider = ({
  value,
  onChange,
  maxValue,
  disabled,
  unit = '%',
  variant = 'default',
}: {
  value: number
  onChange: (value: number) => void
  maxValue?: number
  disabled?: boolean
  unit?: string
  variant?: 'default' | 'long' | 'short' | 'white'
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
        rangeClassName={classNames(
          variant === 'long'
            ? '!bg-perps-green'
            : variant === 'short'
              ? '!bg-perps-red'
              : variant === 'white'
                ? '!bg-white'
                : '!bg-perps-blue',
        )}
        trackClassName={classNames(
          variant === 'long'
            ? '!bg-perps-green/[0.08]'
            : variant === 'short'
              ? '!bg-perps-red/[0.08]'
              : variant === 'white'
                ? '!bg-white/[0.08]'
                : '!bg-perps-blue/[0.08]',
        )}
        thumbClassName={classNames(
          'border-[6px] backdrop-blur-lg',
          variant === 'long'
            ? '!border-perps-green !bg-perps-green/20'
            : variant === 'short'
              ? '!border-perps-red !bg-perps-red/20'
              : variant === 'white'
                ? '!border-white !bg-white/20'
                : '!border-perps-blue !bg-perps-blue/20',
        )}
      />
      <div
        className={classNames(
          'border max-w-[58px] min-w-[58px] flex items-center justify-center !rounded-lg !border-[#FFFFFF1A] !bg-transparent py-0 px-2 whitespace-nowrap text-sm font-medium text-right',
        )}
      >
        <TextField
          type="number"
          variant="naked"
          onValueChange={_onChange}
          value={pending ? localValue : value.toString()}
          maxDecimals={0}
          wrapperClassName="max-h-[25px]"
        />
        <p className="text-perps-muted-50">{unit}</p>
      </div>
    </div>
  )
}

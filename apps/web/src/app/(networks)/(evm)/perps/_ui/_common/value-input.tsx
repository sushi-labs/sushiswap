'use client'
import { TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'

export const ValueInput = ({
  value,
  onChange,
  onBlur,
  label,
  maxDecimals,
  className,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  label: string
  maxDecimals: number
  className?: string
  placeholder?: string
}) => {
  const [pending, startTransition] = useTransition()

  const [localValue, setLocalValue] = useState<string>('')

  const _onChange = useCallback(
    (value: string) => {
      setLocalValue(value)
      startTransition(() => {
        onChange(value)
      })
    },
    [onChange],
  )

  return (
    <div
      className={classNames(
        'w-full border rounded-lg px-4 py-2 border-[#FFFFFF1A] bg-[#FFFFFF0D]',
        className ?? '',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[#4A5565] whitespace-nowrap">{label}</p>
        <TextField
          type="number"
          variant="naked"
          onValueChange={_onChange}
          value={pending ? localValue : value}
          maxDecimals={maxDecimals}
          className={classNames('!text-lg font-medium text-right')}
          onBlur={onBlur}
          placeholder={placeholder ?? undefined}
        />
      </div>
    </div>
  )
}

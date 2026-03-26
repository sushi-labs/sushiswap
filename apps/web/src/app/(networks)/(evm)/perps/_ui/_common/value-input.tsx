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
  inputClassName,
  placeholder,
  type = 'number',
}: {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  label: string
  maxDecimals?: number
  className?: string
  inputClassName?: string
  placeholder?: string
  type?: 'number' | 'text' | 'percent'
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
        'w-full border rounded-lg px-2 py-0 border-[#FFFFFF1A] bg-[#FFFFFF0D]',
        className ?? '',
      )}
    >
      <div className="flex items-center justify-between gap-2 max-h-[35px]">
        <p className="text-[#8f9399] whitespace-nowrap">{label}</p>
        <TextField
          type={type}
          variant="naked"
          onValueChange={_onChange}
          value={pending ? localValue : value}
          maxDecimals={maxDecimals}
          className={classNames(
            '!text-lg font-medium text-right',
            inputClassName ?? '',
          )}
          onBlur={onBlur}
          placeholder={placeholder ?? undefined}
        />
      </div>
    </div>
  )
}

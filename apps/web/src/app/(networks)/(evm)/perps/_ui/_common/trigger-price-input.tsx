'use client'
import { TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'

export const TriggerPriceInput = ({
  value,
  onChange,
  className,
  maxDecimals,
}: {
  value: string
  onChange?: (value: string) => void
  className?: string
  maxDecimals: number
}) => {
  const [pending, startTransition] = useTransition()

  const [localValue, setLocalValue] = useState<string>('')

  const _onChange = useCallback(
    (value: string) => {
      setLocalValue(value)
      startTransition(() => {
        onChange?.(value)
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
      <div className="flex items-center justify-between gap-2 max-h-[35px]">
        <p className="text-[#8f9399] whitespace-nowrap">Trigger Price (USDC)</p>
        <TextField
          type="number"
          variant="naked"
          onValueChange={_onChange}
          value={pending ? localValue : value}
          maxDecimals={maxDecimals}
          className={classNames('!text-lg font-medium text-right')}
        />
      </div>
    </div>
  )
}

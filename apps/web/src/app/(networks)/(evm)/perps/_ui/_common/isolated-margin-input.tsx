'use client'
import { TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'
import { TableButton } from './table-button'

export const IsolatedMarginInput = ({
  value,
  onChange,
  setMax,
  className,
}: {
  value: string
  onChange: (value: string) => void
  setMax: () => void
  className?: string
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
      <div className="flex items-center justify-between gap-2">
        <p className="text-[#8f9399]">Amount</p>
        <div className="flex items-center gap-1 max-h-[35px]">
          <TextField
            type="number"
            variant="naked"
            onValueChange={_onChange}
            value={pending ? localValue : value}
            maxDecimals={6}
            className={classNames('!text-lg font-medium text-right')}
          />
          <TableButton onClick={setMax}>Max</TableButton>
        </div>
      </div>
    </div>
  )
}

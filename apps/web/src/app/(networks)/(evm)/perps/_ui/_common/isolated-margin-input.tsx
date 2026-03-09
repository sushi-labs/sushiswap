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
        'w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50',
        className ?? '',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground">Amount</p>
        <div className="flex items-center gap-1">
          <TextField
            type="number"
            variant="naked"
            onValueChange={_onChange}
            value={pending ? localValue : value}
            maxDecimals={2}
            className={classNames('!text-lg font-medium text-right')}
          />
          <TableButton onClick={setMax}>Max</TableButton>
        </div>
      </div>
    </div>
  )
}

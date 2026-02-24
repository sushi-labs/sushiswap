import { TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'

export const TriggerPriceInput = ({
  value,
  onChange,
  className,
}: {
  value: string
  onChange?: (value: string) => void
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
        <p className="text-muted-foreground whitespace-nowrap">
          Triger Price (USDC)
        </p>
        <TextField
          type="number"
          variant="naked"
          onValueChange={_onChange}
          value={pending ? localValue : value}
          maxDecimals={2}
          className={classNames('!text-lg font-medium text-right')}
        />
      </div>
    </div>
  )
}

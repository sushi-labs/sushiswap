import { Button, TextField, classNames } from '@sushiswap/ui'
import { useCallback, useState, useTransition } from 'react'

export const LimitInput = ({
  currentMidPrice,
  value,
  onChange,
  maxDecimals,
}: {
  currentMidPrice: string | null
  value: string
  onChange: (value: string) => void
  maxDecimals: number
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

  const handleSetToCurrentMidPrice = useCallback(() => {
    if (currentMidPrice) {
      setLocalValue(currentMidPrice)
      startTransition(() => {
        onChange(currentMidPrice)
      })
    }
  }, [currentMidPrice, onChange])

  return (
    <div className="w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50">
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground">Price (USDC)</p>
        <div className="flex items-center gap-1">
          <TextField
            type="number"
            variant="naked"
            onValueChange={_onChange}
            value={pending ? localValue : value}
            maxDecimals={maxDecimals}
            className={classNames('!text-lg font-medium text-right')}
          />
          <Button
            size="xs"
            variant="secondary"
            onClick={handleSetToCurrentMidPrice}
          >
            Mid
          </Button>
        </div>
      </div>
    </div>
  )
}

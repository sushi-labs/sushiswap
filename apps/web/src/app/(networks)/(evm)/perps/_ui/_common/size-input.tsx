import { TextField, classNames } from '@sushiswap/ui'
import { useCallback, useMemo, useState, useTransition } from 'react'
import type { PerpOrSpotAsset } from 'src/lib/perps/subscription/use-asset-list'
import { useSymbolSplit } from 'src/lib/perps/use-symbol-split'
import { SideToggle } from './side-toggle'

export const SizeInput = ({
  asset,
  value,
  onChange,
  sizeSide,
  setSizeSide,
  className,
}: {
  asset: PerpOrSpotAsset | undefined
  value: { base: string; quote: string }
  onChange?: (value: string) => void
  sizeSide: 'base' | 'quote'
  setSizeSide: (sizeSide: 'base' | 'quote') => void
  className?: string
}) => {
  const [pending, startTransition] = useTransition()

  const { baseSymbol, quoteSymbol } = useSymbolSplit({ asset })
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

  const _value = useMemo(() => {
    if (sizeSide === 'base') {
      return value.base
    } else {
      return value.quote
    }
  }, [sizeSide, value])

  return (
    <div
      className={classNames(
        'w-full border rounded-lg border-accent px-4 py-2 dark:bg-slate-700 bg-slate-50',
        className ?? '',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground">Size</p>
        <div className="flex items-center gap-1">
          <TextField
            type="number"
            variant="naked"
            disabled={!asset}
            onValueChange={_onChange}
            value={pending ? localValue : _value}
            readOnly={!asset}
            maxDecimals={asset?.decimals}
            className={classNames('!text-lg font-medium text-right')}
          />
          <SideToggle
            side={sizeSide}
            setSide={setSizeSide}
            baseSymbol={baseSymbol}
            quoteSymbol={quoteSymbol}
          />
        </div>
      </div>
    </div>
  )
}

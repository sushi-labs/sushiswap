'use client'
import { Button, classNames } from '@sushiswap/ui'
type DefaultSide = 'base' | 'quote'

interface SideToggleProps<T extends string = DefaultSide> {
  side: T
  setSide: (side: T) => void
  options?: [T, T]
  baseSymbol: string
  quoteSymbol: string
}

export const SideToggle = <T extends string = DefaultSide>({
  side,
  setSide,
  options,
  baseSymbol,
  quoteSymbol,
}: SideToggleProps<T>) => {
  const resolvedOptions = options ?? (['base', 'quote'] as unknown as [T, T])
  const [left, right] = resolvedOptions
  return (
    <div className="flex items-centerrounded-lg p-0.5">
      <Button
        size="xs"
        variant={'ghost'}
        onClick={() => setSide(left)}
        className={classNames(
          'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
          side === right ? 'text-[#6A7282]' : '',
        )}
      >
        {baseSymbol}
      </Button>
      <Button
        size="xs"
        variant={'ghost'}
        onClick={() => setSide(right)}
        className={classNames(
          'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
          side === left ? 'text-muted-foreground' : '',
        )}
      >
        {quoteSymbol}
      </Button>
    </div>
  )
}

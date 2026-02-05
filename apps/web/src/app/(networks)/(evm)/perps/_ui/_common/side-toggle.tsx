import { Button, classNames } from '@sushiswap/ui'

export const SideToggle = ({
  side,
  setSide,
  baseSymbol,
  quoteSymbol,
}: {
  side: 'base' | 'quote'
  setSide: (side: 'base' | 'quote') => void
  baseSymbol: string
  quoteSymbol: string
}) => {
  return (
    <div className="flex items-center border border-accent rounded-lg p-0.5">
      <Button
        size="xs"
        variant={side === 'base' ? 'secondary' : 'ghost'}
        onClick={() => setSide('base')}
        className={classNames(
          'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
          side === 'quote' ? 'text-muted-foreground' : '',
        )}
      >
        {baseSymbol}
      </Button>
      <Button
        size="xs"
        variant={side === 'quote' ? 'secondary' : 'ghost'}
        onClick={() => setSide('quote')}
        className={classNames(
          'text-xs !min-h-[18px] !h-[18px] !px-1 !rounded-md',
          side === 'base' ? 'text-muted-foreground' : '',
        )}
      >
        {quoteSymbol}
      </Button>
    </div>
  )
}

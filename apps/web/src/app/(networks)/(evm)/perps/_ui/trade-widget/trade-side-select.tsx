import { Button, classNames } from '@sushiswap/ui'
import { PerpsCard } from '../_common/perps-card'
import { useAssetState } from './asset-state-provider'

export const TradeSideSelect = () => {
  const {
    state: { tradeSide, asset, tradeType },
    mutate: { setTradeSide },
  } = useAssetState()

  const longLabel =
    tradeType === 'basis trade'
      ? 'Buy / Short'
      : `Buy${asset?.marketType === 'perp' ? ' / Long' : ''}`
  const shortLabel =
    tradeType === 'basis trade'
      ? 'Sell / Long'
      : `Sell${asset?.marketType === 'perp' ? ' / Short' : ''}`

  return (
    <PerpsCard className="flex items-center w-full">
      <Button
        size="sm"
        variant={tradeSide === 'long' ? 'perps-long' : 'ghost'}
        className={classNames(
          'border border-transparent',
          tradeSide === 'short' ? 'text-muted-foreground' : '',
        )}
        fullWidth
        onClick={() => setTradeSide('long')}
      >
        {longLabel}
      </Button>
      <Button
        size="sm"
        variant={tradeSide === 'short' ? 'perps-short' : 'ghost'}
        className={classNames(
          'border border-transparent',
          tradeSide === 'long' ? 'text-muted-foreground' : '',
        )}
        fullWidth
        onClick={() => setTradeSide('short')}
      >
        {shortLabel}
      </Button>
    </PerpsCard>
  )
}

import { Button, classNames } from '@sushiswap/ui'
import { PerpsCard } from '../_common/perps-card'
import { useAssetState } from './asset-state-provider'

export const TradeSideSelect = () => {
  const {
    state: { tradeSide, asset },
    mutate: { setTradeSide },
  } = useAssetState()

  return (
    <PerpsCard className="flex items-center w-full">
      <Button
        size="sm"
        variant={tradeSide === 'long' ? 'perps-long' : 'ghost'}
        className={classNames(
          tradeSide === 'short'
            ? 'text-muted-foreground border border-transparent'
            : '',
        )}
        fullWidth
        onClick={() => setTradeSide('long')}
      >
        Buy{asset?.marketType === 'perp' ? ' / Long' : ''}
      </Button>
      <Button
        size="sm"
        variant={tradeSide === 'short' ? 'perps-short' : 'ghost'}
        className={classNames(
          tradeSide === 'long'
            ? 'text-muted-foreground border border-transparent'
            : '',
        )}
        fullWidth
        onClick={() => setTradeSide('short')}
      >
        Sell{asset?.marketType === 'perp' ? ' / Short' : ''}
      </Button>
    </PerpsCard>
  )
}

import { Button } from '@sushiswap/ui'
import { useAssetState } from './asset-state-provider'

export const TradeSideSelect = () => {
  const {
    state: { tradeSide },
    mutate: { setTradeSide },
  } = useAssetState()

  return (
    <div className="flex items-center w-full p-0.5 bg-secondary rounded-2xl border border-accent">
      <Button
        size="sm"
        variant={tradeSide === 'long' ? 'default' : 'ghost'}
        fullWidth
        onClick={() => setTradeSide('long')}
      >
        Buy / Long
      </Button>
      <Button
        size="sm"
        variant={tradeSide === 'short' ? 'destructive' : 'ghost'}
        fullWidth
        onClick={() => setTradeSide('short')}
      >
        Sell / Short
      </Button>
    </div>
  )
}

import { Button, classNames } from '@sushiswap/ui'
import { useAssetState } from './asset-state-provider'

export const TradeSideSelect = () => {
  const {
    state: { tradeSide, asset },
    mutate: { setTradeSide },
  } = useAssetState()

  return (
    <div className="flex items-center w-full p-0.5 gap-2 rounded-2xl">
      <Button
        size="sm"
        variant={tradeSide === 'long' ? 'perps-long' : 'perps-secondary'}
        data-glow={(tradeSide === 'long').toString()}
        className={classNames(
          tradeSide !== 'long' ? '!bg-[#C7C7C71C] border-[#A4A4A480]' : '',
        )}
        fullWidth
        onClick={() => setTradeSide('long')}
      >
        Buy{asset?.marketType === 'perp' ? ' / Long' : ''}
      </Button>
      <Button
        size="sm"
        variant={tradeSide === 'short' ? 'perps-short' : 'perps-secondary'}
        data-glow={(tradeSide === 'short').toString()}
        className={classNames(
          tradeSide !== 'short' ? '!bg-[#C7C7C71C] border-[#A4A4A480]' : '',
        )}
        fullWidth
        onClick={() => setTradeSide('short')}
      >
        Sell{asset?.marketType === 'perp' ? ' / Short' : ''}
      </Button>
    </div>
  )
}

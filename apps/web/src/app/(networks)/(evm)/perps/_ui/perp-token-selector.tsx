import { Card } from '@sushiswap/ui'
import { useAssetListState } from './asset-list-provider'
import { usePerpState } from './perp-state-provider'
import { TokenStats } from './token-stats/token-stats'

export const PerpTokenSelector = () => {
  const {
    state: { activeAsset },
  } = usePerpState()
  const {
    state: {
      assetListQuery: { data },
    },
  } = useAssetListState()
  const token = data?.get?.(activeAsset)
  return (
    <Card className="p-4 gap-8 flex items-center">
      <div className="whitespace-nowrap">
        {token?.symbol} {token?.maxLeverage ? `${token.maxLeverage}x` : 'Spot'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="grid grid-flow-col auto-cols-max gap-8">
            <TokenStats />
          </div>
        </div>
      </div>
    </Card>
  )
}

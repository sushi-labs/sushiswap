import { Card } from '@sushiswap/ui'
import { AssetSelector } from './asset-selector/asset-selector'
import { AssetStats } from './asset-stats/asset-stats'

export const AssetSelectorAndStats = () => {
  return (
    <Card className="p-4 gap-8 flex items-center">
      <AssetSelector />
      <div className="flex-1 min-w-0">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="grid grid-flow-col auto-cols-max gap-8">
            <AssetStats />
          </div>
        </div>
      </div>
    </Card>
  )
}

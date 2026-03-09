import { Card } from '@sushiswap/ui'
import { AssetSelector } from './asset-selector'
import { AssetStats } from './asset-stats/asset-stats'

export const AssetSelectorAndStats = () => {
  return (
    <Card className="p-4 gap-8 flex items-center">
      <AssetSelector />
      <div className="flex-1 min-w-0">
        <AssetStats />
      </div>
    </Card>
  )
}

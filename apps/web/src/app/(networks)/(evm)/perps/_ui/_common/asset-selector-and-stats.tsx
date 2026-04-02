import { Card } from '@sushiswap/ui'
import { AssetSelector } from '../asset-selector'
import { AssetStats } from '../asset-stats'

export const AssetSelectorAndStats = () => {
  return (
    <Card className="px-4 lg:py-2 gap-8 flex items-center !bg-[#0D1421] border border-[#1E2939]">
      <AssetSelector />
      <div className="flex-1 min-w-0">
        <AssetStats />
      </div>
    </Card>
  )
}

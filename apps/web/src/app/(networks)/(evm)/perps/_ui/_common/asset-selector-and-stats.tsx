import { SkeletonBox } from '@sushiswap/ui'
import { AssetSelector } from '../asset-selector'
import { FavoriteButton } from '../asset-selector/favorite-button'
import { AssetStats } from '../asset-stats'
import { useAssetState } from '../trade-widget'
import { PerpsCard } from './perps-card'

export const AssetSelectorAndStats = () => {
  const {
    state: { asset },
  } = useAssetState()
  return (
    <PerpsCard className="px-2 py-2 gap-4 lg:gap-8 flex flex-col lg:flex-row lg:items-center">
      <div className="flex items-center gap-2">
        <AssetSelector />
        {!asset?.name ? (
          <SkeletonBox className="w-[32px] h-8" />
        ) : (
          <FavoriteButton
            assetString={asset?.name}
            size="sm"
            variant="perps-secondary"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <AssetStats />
      </div>
    </PerpsCard>
  )
}

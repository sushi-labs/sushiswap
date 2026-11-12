import { OverflowX } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useAssetListState } from '../asset-selector'
import { useAssetState } from '../trade-widget'
import { PerpAssetStats } from './perp-asset-stats'
import { SpotAssetStats } from './spot-asset-stats'

export const AssetStats = () => {
  const {
    state: {
      assetListQuery: { data },
    },
  } = useAssetListState()
  const {
    state: { activeAsset },
  } = useAssetState()
  const asset = useMemo(() => data?.get?.(activeAsset), [data, activeAsset])

  return (
    <OverflowX variant="perps" hideScrollBtns={!asset}>
      <div className="grid grid-flow-col auto-cols-max gap-6 md:gap-8 lg:gap-12">
        {asset?.marketType === 'perp' ? <PerpAssetStats /> : <SpotAssetStats />}
      </div>
    </OverflowX>
  )
}

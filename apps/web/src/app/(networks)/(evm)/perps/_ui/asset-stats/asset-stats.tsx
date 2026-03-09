import { useMemo } from 'react'
import { OverflowX } from '../_common'
import { useAssetListState } from '../asset-selector/asset-list-provider'
import { useAssetState } from '../trade-widget/asset-state-provider'
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
    <OverflowX hideScrollBtns={!asset}>
      <div className="grid grid-flow-col auto-cols-max gap-8">
        {asset?.marketType === 'perp' ? <PerpAssetStats /> : <SpotAssetStats />}
      </div>
    </OverflowX>
  )
}

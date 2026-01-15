import { useAssetListState } from '../asset-list-provider'
import { useAssetState } from '../asset-state-provider'
import { OverflowX } from '../overflow-x'
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
  const asset = data?.get?.(activeAsset)

  return (
    <OverflowX hideScrollBtns={!asset}>
      <div className="grid grid-flow-col auto-cols-max gap-8">
        {asset?.marketType === 'perp' ? <PerpAssetStats /> : <SpotAssetStats />}
      </div>
    </OverflowX>
  )
}

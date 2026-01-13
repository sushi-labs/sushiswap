import { useAssetListState } from '../asset-list-provider'
import { useAssetState } from '../perp-state-provider'
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
    <>
      {asset?.marketType === 'perp' ? <PerpAssetStats /> : <SpotAssetStats />}
    </>
  )
}

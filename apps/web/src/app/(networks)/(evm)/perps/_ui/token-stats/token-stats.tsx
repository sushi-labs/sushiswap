import { useAssetListState } from '../asset-list-provider'
import { usePerpState } from '../perp-state-provider'
import { PerpTokenStats } from './perp-token-stats'
import { SpotTokenStats } from './spot-token-stats'

export const TokenStats = () => {
  const {
    state: {
      assetListQuery: { data },
    },
  } = useAssetListState()
  const {
    state: { activeAsset },
  } = usePerpState()
  const token = data?.get?.(activeAsset)
  return (
    <>
      {token?.marketType === 'perp' ? <PerpTokenStats /> : <SpotTokenStats />}
    </>
  )
}

import { useAssetList } from 'src/lib/perps/use-asset-list'
import { PerpTokenStats } from './perp-token-stats'
import { SpotTokenStats } from './spot-token-stats'

export const TokenStats = () => {
  const { data } = useAssetList()
  //todo: provider for selected token
  // const token = data?.perp?.get?.('BTC')
  const token = data?.spot?.get?.('@1')
  return (
    <>
      {token?.marketType === 'perp' ? <PerpTokenStats /> : <SpotTokenStats />}
    </>
  )
}

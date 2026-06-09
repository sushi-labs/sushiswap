import { useQuery } from '@tanstack/react-query'
import { SPOT_ASSETS_TO_REWRITE } from '../utils'
import { useSpotMeta } from './use-spot-meta'

export const useAssetName = ({ assetString }: { assetString: string }) => {
  const { data } = useSpotMeta()
  return useQuery({
    queryKey: ['asset-meta', assetString],
    queryFn: async () => {
      if (!assetString.includes('@')) {
        //perp
        return assetString
      }
      //spot
      const spotMetaData = data
      const universe = spotMetaData?.universe ?? []
      const tokens = spotMetaData?.tokens ?? []
      const coinMeta = universe.find((u) => u.name === assetString)
      if (!coinMeta) return assetString
      const token = tokens[coinMeta.tokens[0]]
      if (SPOT_ASSETS_TO_REWRITE.has(token.name)) {
        return SPOT_ASSETS_TO_REWRITE.get(token.name)
      }
      return token.name
    },

    enabled: Boolean(data),
  })
}

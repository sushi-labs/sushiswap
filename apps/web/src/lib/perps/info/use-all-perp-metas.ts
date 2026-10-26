import { allPerpMetas } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { hlHttpTransport } from '../transports'

export { getCollateralTokenForDex, getPerpMetaForDex } from './perp-meta'

export const useAllPerpMetas = () => {
  return useQuery({
    queryKey: ['all-perp-metas'],
    queryFn: async () => {
      return await allPerpMetas({
        transport: hlHttpTransport,
      })
    },
  })
}

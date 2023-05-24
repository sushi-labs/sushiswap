import { useQuery } from '@tanstack/react-query'
import { isSupportedChainId } from '../../config'
import { getBuiltGraphSDK } from '../../.graphclient'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { FuroStreamChainId } from '@sushiswap/furo/exports/exports'

const GRAPH_HOST = 'api.thegraph.com'

interface UseUserStreams {
  chainId: FuroStreamChainId
  account: string | undefined
}

export const useUserStreams = ({ chainId, account }: UseUserStreams) => {
  return useQuery({
    queryKey: ['useUserStreams', { chainId }],
    queryFn: async () => {
      if (!account || !isSupportedChainId(chainId)) return null

      const sdk = getBuiltGraphSDK({
        chainId,
        host: GRAPH_HOST,
        name: FURO_SUBGRAPH_NAME[chainId],
      })

      const data = await sdk.userStreams({ id: account })
      return data ?? null
    },
  })
}

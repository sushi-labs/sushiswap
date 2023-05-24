import { useQuery } from '@tanstack/react-query'
import { isSupportedChainId } from '../../config'
import { getBuiltGraphSDK } from '../../.graphclient'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { ChainId } from '@sushiswap/chain'
import { queryRebaseDTO } from './useRebaseDTO'
import { Vesting } from '../Vesting'

const GRAPH_HOST = 'api.thegraph.com'

interface UseStream {
  chainId: ChainId
  vestingId: string
  enabled?: boolean
}

export const useVesting = ({ chainId, vestingId, enabled = true }: UseStream) => {
  return useQuery({
    queryKey: ['useVesting', { vestingId }],
    queryFn: async () => {
      if (!isSupportedChainId(chainId)) return null

      const sdk = getBuiltGraphSDK({
        chainId,
        host: GRAPH_HOST,
        name: FURO_SUBGRAPH_NAME[chainId],
      })

      const data = await sdk.vesting({ id: vestingId })
      const token = data?.vesting?.token.id
      const rebase = await queryRebaseDTO({ chainId, address: token })

      return data.vesting && rebase ? new Vesting({ chainId, furo: data.vesting, rebase }) : null
    },
    refetchInterval: 60000,
    enabled,
  })
}

import { ChainId } from 'sushi/chain'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { useQuery } from '@tanstack/react-query'

import { getBuiltGraphSDK } from '../../.graphclient'
import { isSupportedChainId } from '../../config'
import { Vesting } from '../Vesting'
import { queryRebaseDTO } from './useRebaseDTO'

const GRAPH_HOST = 'api.thegraph.com'

interface UseStream {
  chainId: ChainId
  vestingId: string
  enabled?: boolean
}

export const useVesting = ({ chainId, vestingId, enabled = true }: UseStream) => {
  return useQuery({
    queryKey: ['useVesting', { chainId, vestingId }],
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

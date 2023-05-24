import { useQuery } from '@tanstack/react-query'
import { isSupportedChainId } from '../../config'
import { getBuiltGraphSDK } from '../../.graphclient'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { ChainId } from '@sushiswap/chain'
import { Transaction } from '../Transaction'

const GRAPH_HOST = 'api.thegraph.com'

interface UseStreamTransactions {
  chainId: ChainId
  streamId: string
  enabled?: boolean
}
export const useStreamTransactions = ({ chainId, streamId, enabled = true }: UseStreamTransactions) => {
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      if (!isSupportedChainId(chainId)) return null

      const sdk = getBuiltGraphSDK({
        chainId,
        host: GRAPH_HOST,
        name: FURO_SUBGRAPH_NAME[chainId],
      })

      const data = await sdk.streamTransactions({ where: { stream: streamId } })
      return data?.transactions ? data.transactions.map((transaction) => new Transaction(transaction, chainId)) : null
    },
    enabled,
  })
}

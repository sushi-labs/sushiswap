import {
  type PoolTransactionType,
  getPoolTransactions,
} from '@sushiswap/graph-client/kadena'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

export const usePoolTransactions = ({
  pairId,
  type,
  pageSize = 10,
}: {
  pairId: string | undefined
  type: PoolTransactionType
  pageSize?: number
}) => {
  return useQuery({
    queryKey: ['kadena-pool-transactions', pairId, type, pageSize],
    queryFn: async () => {
      if (!pairId) {
        throw new Error('Pair ID is required')
      }

      const data = await getPoolTransactions({
        pairId,
        type,
        first: pageSize,
      })

      return {
        transactions: data.edges.map((e) => e.node),
        pageInfo: data.pageInfo,
        totalCount: data.totalCount,
      }
    },
    enabled: Boolean(pairId),
    staleTime: ms('10s'),
  })
}

import { useQuery } from '@tanstack/react-query'
import type { PoolTransaction } from '~kadena/_common/types/get-pool-by-id'

export enum TransactionType {
  SWAP = 'SWAP',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
  REMOVE_LIQUIDITY = 'REMOVE_LIQUIDITY',
}

interface PoolTransactionsApiResponse {
  success: boolean
  data: {
    transactions: PoolTransaction[]
    totalCount: number
  }
}

export const usePoolTransactions = ({
  pairId,
  type,
  pageSize = 10,
}: {
  pairId: string | undefined
  type: TransactionType
  pageSize?: number
}) => {
  return useQuery({
    queryKey: ['kadena-pool-transactions', pairId, type, pageSize],
    queryFn: async () => {
      const url = new URL(
        `/kadena/api/pools/${pairId}/transactions`,
        window.location.origin,
      )
      url.searchParams.set('type', type)
      url.searchParams.set('first', String(pageSize))

      const res = await fetch(url.toString())
      const json: PoolTransactionsApiResponse = await res.json()

      if (!json.success) {
        console.error('Failed to fetch pool transactions:', json)
        throw new Error('Failed to fetch pool transactions')
      }

      return json.data
    },
    enabled: !!pairId,
    staleTime: 60 * 1000,
  })
}

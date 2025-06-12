import { useInfiniteQuery } from '@tanstack/react-query'
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
    pageInfo: {
      endCursor: string
      hasNextPage: boolean
    }
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
  return useInfiniteQuery({
    queryKey: ['pool-transactions', pairId, type],
    queryFn: async ({ pageParam = null }) => {
      console.log('Fetching pool transactions with pageParam:', pageParam)

      const url = new URL(
        `/kadena/api/pools/${pairId}/transactions`,
        window.location.origin,
      )
      url.searchParams.set('type', type)
      url.searchParams.set('first', String(pageSize))
      if (pageParam) url.searchParams.set('after', String(pageParam))

      console.log('Fetching from URL:', url.toString())

      const res = await fetch(url.toString())
      const json: PoolTransactionsApiResponse = await res.json()

      console.log('API response:', {
        success: json.success,
        transactionCount: json.data?.transactions?.length,
      })

      if (!json.success) {
        console.error('Failed to fetch pool transactions:', json)
        throw new Error('Failed to fetch pool transactions')
      }

      console.log('Successfully fetched pool transactions:', {
        transactionCount: json.data.transactions.length,
        hasNextPage: json.data.pageInfo.hasNextPage,
        endCursor: json.data.pageInfo.endCursor,
      })

      return json.data
    },
    select: (data) => {
      const flat = data.pages.flatMap((p) => p.transactions)
      return { ...data, transactions: flat }
    },

    getNextPageParam: (lastPage: PoolTransactionsApiResponse['data']) => {
      const nextParam = lastPage.pageInfo.hasNextPage
        ? lastPage.pageInfo.endCursor
        : undefined
      console.log('getNextPageParam result:', nextParam)
      return nextParam
    },
    initialPageParam: null,
    staleTime: 60 * 1000,
    enabled: !!pairId,
  })
}

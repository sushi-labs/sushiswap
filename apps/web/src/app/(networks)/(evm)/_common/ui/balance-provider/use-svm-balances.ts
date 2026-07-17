import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import type { SvmAddress, SvmChainId } from 'sushi/svm'
import { STALE_TIME } from './config'
import type { UseBalancesReturn } from './types'

export function useSvmBalances(
  chainId: SvmChainId | undefined,
  tokenAddresses: SvmAddress[] | undefined,
): UseBalancesReturn<SvmChainId> {
  const account = useAccount('svm')

  const uniqueTokenAddresses = useMemo(() => {
    if (!tokenAddresses) {
      return undefined
    }
    return Array.from(new Set(tokenAddresses))
  }, [tokenAddresses])

  const hasTokens = Boolean(uniqueTokenAddresses?.length)

  const query = useQuery({
    queryKey: [
      'svm-balances',
      { chainId, account, tokenAddresses: uniqueTokenAddresses },
    ],
    queryFn: async () => {
      if (!chainId || !account || !uniqueTokenAddresses) {
        throw new Error('Missing parameters for fetching SVM balances')
      }

      const { fetchSvmBalances } = await import('./fetch-svm-balances')
      return fetchSvmBalances({
        chainId: chainId,
        tokenAddresses: uniqueTokenAddresses,
        account,
      })
    },
    enabled: Boolean(chainId && account && hasTokens),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
  })

  return useMemo(() => {
    if (!chainId || !tokenAddresses) {
      return {
        data: undefined,
        isError: false,
        isLoading: false,
        isFetching: false,
      }
    }

    if (!hasTokens) {
      return {
        data: new Map(),
        isError: false,
        isLoading: false,
        isFetching: false,
      }
    }

    return {
      data: query.data,
      isError: query.isError,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
    }
  }, [
    query.data,
    query.isError,
    query.isFetching,
    query.isLoading,
    chainId,
    tokenAddresses,
    hasTokens,
  ])
}

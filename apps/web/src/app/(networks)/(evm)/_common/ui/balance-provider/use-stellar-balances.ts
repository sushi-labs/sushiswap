import { type QueryClient, useQueries } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { StellarChainId, type StellarContractAddress } from 'sushi/stellar'
import type { UseBalancesReturn } from './types'

export async function invalidateStellarBalances(
  client: QueryClient,
): Promise<void> {
  await Promise.all([
    client.invalidateQueries({ queryKey: ['stellar-balances'] }),
    client.invalidateQueries({
      queryKey: [
        'data-api-token-list-balances',
        { chainId: StellarChainId.STELLAR },
      ],
    }),
  ])
}

export function useStellarBalances(
  chainId: StellarChainId | undefined,
  tokenAddresses: StellarContractAddress[] | undefined,
): UseBalancesReturn<StellarChainId> {
  const account = useAccount('stellar')
  const uniqueTokenAddresses = useMemo(
    () => Array.from(new Set(tokenAddresses)),
    [tokenAddresses],
  )
  const enabled = Boolean(chainId && account)
  const queries = useQueries({
    queries: uniqueTokenAddresses.map((tokenAddress) => ({
      // Inputs and multi-token checkers must observe the same account/token query.
      queryKey: ['stellar-balances', { chainId, account, tokenAddress }],
      queryFn: async () => {
        if (!chainId || !account) {
          throw new Error('Missing parameters for fetching Stellar balances')
        }
        const { fetchStellarBalances } = await import(
          './fetch-stellar-balances'
        )
        return fetchStellarBalances({
          chainId,
          account,
          tokenAddresses: [tokenAddress],
        })
      },
      enabled,
      staleTime: ms('5s'),
      refetchInterval: ms('5s'),
    })),
  })

  const isError = queries.some((query) => query.isError)
  const isLoading = queries.some((query) => query.isLoading)
  const isFetching = queries.some((query) => query.isFetching)
  const unavailable =
    !enabled ||
    !tokenAddresses ||
    isError ||
    queries.some((query) => !query.data)
  return {
    data: unavailable
      ? undefined
      : new Map(queries.flatMap((query) => [...(query.data ?? [])])),
    isError,
    isLoading,
    isFetching,
  }
}

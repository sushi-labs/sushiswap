import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { getNativeAddress } from 'sushi'
import type {
  StellarAddress,
  StellarChainId,
  StellarContractAddress,
} from 'sushi/stellar'
import { contractAddresses } from '../../../../(non-evm)/stellar/_common/lib/soroban/contracts'
import { getTokenBalance } from '../../../../(non-evm)/stellar/_common/lib/soroban/token-helpers'
import { STALE_TIME } from './config'
import type { UseBalancesReturn } from './types'

type FetchStellarBalancesParams = {
  chainId: StellarChainId
  tokenAddresses: StellarContractAddress[]
  account: StellarAddress
}

const fetchStellarBalances = async ({
  chainId,
  tokenAddresses,
  account,
}: FetchStellarBalancesParams): Promise<
  ReadonlyMap<StellarAddress, bigint>
> => {
  const nativeAddress = getNativeAddress(chainId) as StellarContractAddress
  const xlmContract = contractAddresses.TOKENS.XLM
  const uniqueTokenAddresses = Array.from(new Set(tokenAddresses))

  // The native placeholder doesn't exist on-chain; XLM lives at its own
  // contract address. Map native -> XLM contract for the lookup, then
  // attribute the result back to whichever address the caller asked for.
  const balances = await Promise.all(
    uniqueTokenAddresses.map(async (address) => {
      const contractAddress = address === nativeAddress ? xlmContract : address
      const balance = await getTokenBalance(account, contractAddress)
      return [address, balance] as const
    }),
  )

  return new Map(balances)
}

export function useStellarBalances(
  chainId: StellarChainId | undefined,
  tokenAddresses: StellarContractAddress[] | undefined,
): UseBalancesReturn<StellarChainId> {
  const account = useAccount('stellar')

  const uniqueTokenAddresses = useMemo(() => {
    if (!tokenAddresses) {
      return undefined
    }
    return Array.from(new Set(tokenAddresses))
  }, [tokenAddresses])

  const hasTokens = Boolean(uniqueTokenAddresses?.length)

  const query = useQuery({
    queryKey: [
      'stellar-balances',
      { chainId, account, tokenAddresses: uniqueTokenAddresses },
    ],
    queryFn: () => {
      if (!chainId || !account || !uniqueTokenAddresses) {
        throw new Error('Missing parameters for fetching Stellar balances')
      }

      return fetchStellarBalances({
        chainId,
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

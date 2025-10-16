import { useQuery } from '@tanstack/react-query'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'
import { type Address, zeroAddress } from 'viem'

import { serialize, useBalance, useConfig } from 'wagmi'
import { useWatchByInterval } from '../watch/useWatchByInterval'
import { queryFnUseBalances } from './useBalancesWeb3'

interface UseBalanceParams {
  chainId: EvmChainId | undefined
  currency: EvmCurrency | undefined
  account: Address | undefined
  enabled?: boolean
}

export const useBalanceWeb3 = ({
  chainId,
  currency,
  account,
  enabled = true,
}: UseBalanceParams) => {
  const { data: nativeBalance, queryKey } = useBalance({
    chainId,
    address: account,
    query: { enabled },
  })

  const config = useConfig()

  useWatchByInterval({ key: queryKey, interval: 10000 })

  return useQuery({
    queryKey: [
      'useBalance',
      { chainId, currency, account, nativeBalance: serialize(nativeBalance) },
    ],
    queryFn: async () => {
      if (!currency) return null
      const data = await queryFnUseBalances({
        chainId,
        config,
        currencies: [currency],
        account,
        nativeBalance,
      })
      return (
        data?.[
          currency.type === 'native' ? zeroAddress : currency.wrap().address
        ] ?? null
      )
    },
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    enabled: Boolean(chainId && account && enabled),
  })
}

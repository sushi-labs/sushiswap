import { Type } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from '@sushiswap/chain'
import { Address } from 'wagmi'
import { queryFnUseBalances } from './useBalancesWeb3'
import { AddressZero } from '@ethersproject/constants'

interface UseBalanceParams {
  chainId: ChainId
  currency: Type | undefined
  account: Address | undefined
  enabled?: boolean
}

export const useBalanceWeb3 = ({ chainId, currency, account, enabled = true }: UseBalanceParams) => {
  return useQuery({
    queryKey: ['useBalance', { chainId, currency, account }],
    queryFn: async () => {
      if (!currency) return null
      const data = await queryFnUseBalances({ chainId, currencies: [currency], account })
      return data?.[currency.isNative ? AddressZero : currency.wrapped.address]
    },
    refetchInterval: 10000,
    enabled: Boolean(chainId && account && enabled),
  })
}

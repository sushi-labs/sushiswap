import { getAddress } from '@ethersproject/address'
import { Amount, Native, Type } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useTokens } from './tokens'

export const NativeAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

type UseBalancesQuerySelect = (data: Record<string, string>) => Record<string, Amount<Type>>

interface UseBalances {
  account: string | undefined
  chainId: number
  enabled?: boolean
}

// const queryKey = ({ chainId, account }): { account: string; chainId: number } => [
//   `https://balances.sushi.com/v0/${chainId}/${account}`,
// ]

export const useBalancesQuery = ({ chainId, account, enabled = true }: UseBalances, select: UseBalancesQuerySelect) => {
  return useQuery({
    queryKey: [`https://balances.sushi.com/v0/${chainId}/${account}`],
    queryFn: () => {
      return fetch(`https://balances.sushi.com/v0/${chainId}/${account}`).then((response) => response.json())
    },
    staleTime: 900000, // 15 mins
    cacheTime: 3600000, // 1hr
    enabled: Boolean(chainId && account && enabled),
    select,
  })
}

export const useBalances = (variables: UseBalances) => {
  const { chainId } = variables
  const { data: tokens } = useTokens({ chainId })

  const select: UseBalancesQuerySelect = useCallback(
    (data) => {
      if (!tokens) return {}

      return Object.entries(data).reduce<Record<string, Amount<Type>>>((acc, [address, amount]) => {
        if (address.toLowerCase() === NativeAddress) {
          acc[address] = Amount.fromRawAmount(Native.onChain(chainId), amount)
        } else {
          const _address = getAddress(address)
          if (tokens[_address]) {
            acc[_address] = Amount.fromRawAmount(tokens[_address], amount)
          }
        }
        return acc
      }, {})
    },
    [chainId, tokens]
  )

  return useBalancesQuery(variables, select)
}

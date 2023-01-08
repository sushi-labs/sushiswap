import { useQuery } from '@tanstack/react-query'
import { Amount, Token } from '@sushiswap/currency'
import { useCallback } from 'react'
import { useTokens } from './tokens'
import { getAddress } from '@ethersproject/address'

type UseBalancesReturn = Record<string, Amount<Token>>
type UseBalancesQuerySelect = (data: Record<string, string>) => UseBalancesReturn

interface UseBalances {
  account: string | undefined
  chainId: number
}

export const useBalancesQuery = ({ chainId, account }: UseBalances, select: UseBalancesQuerySelect) =>
  useQuery({
    queryKey: [`https://balances.sushi.com/v0/${chainId}/${account}`],
    queryFn: () => fetch(`https://balances.sushi.com/v0/${chainId}/${account}`).then((response) => response.json()),
    staleTime: 20000,
    enabled: Boolean(chainId && account),
    select,
  })

export const useBalances = (variables: UseBalances) => {
  const { chainId } = variables
  const { data: tokens } = useTokens({ chainId })

  const select: UseBalancesQuerySelect = useCallback(
    (data) => {
      if (!tokens) return {}

      return Object.entries(data).reduce<UseBalancesReturn>((acc, [address, amount]) => {
        const _address = getAddress(address)
        if (tokens[_address]) {
          acc[_address] = Amount.fromRawAmount(tokens[_address], amount)
        }
        return acc
      }, {})
    },
    [tokens]
  )

  return useBalancesQuery(variables, select)
}

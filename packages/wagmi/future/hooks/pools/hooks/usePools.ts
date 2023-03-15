import { getAllPools } from '../actions/getAllPools'
import { UsePoolsParams } from '../types'
import { useQuery } from '@tanstack/react-query'

export const usePools = (variables: UsePoolsParams) => {
  return useQuery({
    queryKey: [
      'usePools',
      { chainId: variables.chainId, currencyA: variables.currencyA, currencyB: variables.currencyB },
    ],
    queryFn: async () => await getAllPools(variables),
    refetchInterval: 10000,
    enabled: Boolean(variables.enabled || true),
  })
}

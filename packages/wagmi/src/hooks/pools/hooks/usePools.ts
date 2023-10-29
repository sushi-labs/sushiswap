import { useQuery } from '@tanstack/react-query'
import { getAllPools } from '../actions/getAllPools'
import { UsePoolsParams } from '../types'

export const usePools = ({ enabled = true, ...variables }: UsePoolsParams) => {
  const { chainId, currencyA, currencyB } = variables
  return useQuery({
    queryKey: ['usePools', { chainId, currencyA, currencyB }],
    queryFn: async () => await getAllPools(variables),
    refetchInterval: 10000,
    enabled,
  })
}

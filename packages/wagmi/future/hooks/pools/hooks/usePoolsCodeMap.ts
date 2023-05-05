import { UsePoolsParams } from '../types'
import { useQuery } from '@tanstack/react-query'
import { getAllPoolsCodeMap } from '../actions/getAllPoolsCodeMap'

export const usePoolsCodeMap = (variables: UsePoolsParams) => {
  const { chainId, currencyA, currencyB, enabled } = variables
  return useQuery({
    queryKey: ['usePools', { chainId, currencyA, currencyB }],
    queryFn: async () => await getAllPoolsCodeMap(variables),
    refetchInterval: 10000,
    enabled,
  })
}

import { UsePoolsParams } from '../types'
import { useQuery } from '@tanstack/react-query'
import { getAllPoolsCodeMap } from '../actions/getAllPoolsCodeMap'

export const usePoolsCodeMap = (variables: UsePoolsParams) => {
  return useQuery({
    queryKey: [
      'usePools',
      { chainId: variables.chainId, currencyA: variables.currencyA, currencyB: variables.currencyB },
    ],
    queryFn: async () => await getAllPoolsCodeMap(variables),
    refetchInterval: 10000,
    enabled: Boolean(variables.enabled || true),
  })
}

import { useQuery } from '@tanstack/react-query'
import { getAllPoolsCodeMap } from '../actions/getAllPoolsCodeMap'
import { UsePoolsParams } from '../types'

export const usePoolsCodeMap = ({
  enabled = true,
  ...variables
}: UsePoolsParams) => {
  const { chainId, currencyA, currencyB } = variables
  return useQuery({
    queryKey: ['usePools', { chainId, currencyA, currencyB }],
    queryFn: async () => await getAllPoolsCodeMap(variables),
    refetchInterval: 10000,
    enabled,
  })
}

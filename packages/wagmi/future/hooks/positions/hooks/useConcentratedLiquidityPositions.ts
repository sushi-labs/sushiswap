import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositions } from '../actions'
import { ChainId } from '@sushiswap/chain'

interface UseConcentratedLiquidityPositionsParams {
  account: string | undefined
  chainIds: ChainId[]
  enabled?: boolean
}

export const useConcentratedLiquidityPositions = (variables: UseConcentratedLiquidityPositionsParams) => {
  return useQuery({
    queryKey: ['useConcentratedLiquidityPositions', { chainIds: variables.chainIds, account: variables.account }],
    queryFn: async () =>
      await getConcentratedLiquidityPositions({
        account: variables.account as `0x${string}`,
        chainIds: variables.chainIds,
      }),
    refetchInterval: 10000,
    enabled: Boolean(variables.enabled || true),
  })
}

import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositions } from '../actions'
import { ChainId } from '@sushiswap/chain'
import { ConcentratedLiquidityPosition } from '../types'

interface UseConcentratedLiquidityPositionsParams {
  account: string | undefined
  chainIds: ChainId[]
  enabled?: boolean
  select?(data: ConcentratedLiquidityPosition[] | undefined): ConcentratedLiquidityPosition[] | undefined
}

export const useConcentratedLiquidityPositions = ({
  account,
  chainIds,
  enabled = true,
  select,
}: UseConcentratedLiquidityPositionsParams) => {
  return useQuery({
    queryKey: ['useConcentratedLiquidityPositions', { chainIds, account }],
    queryFn: async () =>
      await getConcentratedLiquidityPositions({
        account: account as `0x${string}`,
        chainIds: chainIds,
      }),
    refetchInterval: 10000,
    enabled: Boolean(account && chainIds && enabled),
    ...(select && { select }),
  })
}

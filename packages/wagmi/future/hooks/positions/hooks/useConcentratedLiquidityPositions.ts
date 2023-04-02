import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositions } from '../actions'
import { ChainId } from '@sushiswap/chain'

interface UseConcentratedLiquidityPositionsParams {
  account: string | undefined
  chainIds: ChainId[]
  enabled?: boolean
}

export const useConcentratedLiquidityPositions = ({
  account,
  chainIds,
  enabled = true,
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
  })
}

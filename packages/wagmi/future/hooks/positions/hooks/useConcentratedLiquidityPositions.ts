import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositions } from '../actions'
import { ConcentratedLiquidityPosition } from '../types'
import { V3ChainId } from '@sushiswap/v3-sdk'
import { Address } from 'wagmi'

interface UseConcentratedLiquidityPositionsParams {
  account: Address | undefined
  chainIds: V3ChainId[]
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
    queryFn: async () => {
      return await getConcentratedLiquidityPositions({
        account: account,
        chainIds,
      })
    },
    refetchInterval: 10000,
    enabled: Boolean(account && chainIds && enabled),
    ...(select && { select }),
  })
}

import { useQuery } from '@tanstack/react-query'
import { SushiSwapV3ChainId } from 'sushi/config'

import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions'

interface UseConcentratedLiquidityPositionsFromTokenIdsParams {
  keys: { tokenId: bigint; chainId: SushiSwapV3ChainId }[] | undefined
  enabled?: boolean
}

export const useConcentratedLiquidityPositionsFromTokenIds = ({
  keys,
  enabled = true,
}: UseConcentratedLiquidityPositionsFromTokenIdsParams) => {
  return useQuery({
    queryKey: ['useConcentratedLiquidityPositionsFromTokenIds', { keys }],
    queryFn: async () => {
      if (!keys) return null

      return await getConcentratedLiquidityPositionsFromTokenIds({
        tokenIds: keys,
      })
    },
    refetchInterval: 10000,
    enabled: Boolean(keys && keys.length > 0 && enabled),
  })
}

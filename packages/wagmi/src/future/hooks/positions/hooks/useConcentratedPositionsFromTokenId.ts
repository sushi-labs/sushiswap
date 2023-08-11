import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useQuery } from '@tanstack/react-query'

import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions'

interface UseConcentratedLiquidityPositionsFromTokenIdParams {
  tokenId: number | string | undefined
  chainId: SushiSwapV3ChainId
  enabled?: boolean
}

export const useConcentratedLiquidityPositionsFromTokenId = ({
  tokenId,
  chainId,
  enabled = true,
}: UseConcentratedLiquidityPositionsFromTokenIdParams) => {
  return useQuery({
    queryKey: ['useConcentratedLiquidityPositionsFromTokenId', { chainId, tokenIds: tokenId }],
    queryFn: async () => {
      // Shouldn't happen
      if (!tokenId) throw new Error('TokenId is undefined')

      const positions = await getConcentratedLiquidityPositionsFromTokenIds({
        tokenIds: [{ tokenId: BigInt(tokenId), chainId }],
      })

      return positions[0]
    },
    refetchInterval: 10000,
    enabled: Boolean(tokenId && chainId && enabled),
    keepPreviousData: true,
  })
}

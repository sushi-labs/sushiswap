import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { SushiSwapV3ChainId } from 'sushi/evm'

import { useConfig } from 'wagmi'
import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions/getConcentratedLiquidityPositionsFromTokenIds'

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
  const config = useConfig()

  return useQuery({
    queryKey: [
      'useConcentratedLiquidityPositionsFromTokenId',
      { chainId, tokenIds: tokenId },
    ],
    queryFn: async () => {
      // Shouldn't happen
      if (!tokenId) throw new Error('TokenId is undefined')

      const positions = await getConcentratedLiquidityPositionsFromTokenIds({
        tokenIds: [{ tokenId: BigInt(tokenId), chainId }],
        config,
      })

      return positions[0]
    },
    refetchInterval: 10000,
    enabled: Boolean(tokenId && chainId && enabled),
    placeholderData: keepPreviousData,
  })
}

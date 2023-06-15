import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions'
import { BigNumber } from 'ethers'
import { V3ChainId } from '@sushiswap/v3-sdk'

interface UseConcentratedLiquidityPositionsFromTokenIdParams {
  tokenId: number | string | undefined
  chainId: V3ChainId
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
      const positions = await getConcentratedLiquidityPositionsFromTokenIds({
        tokenIds: [{ tokenId: BigNumber.from(tokenId), chainId }],
      })

      return positions[0]
    },
    refetchInterval: 10000,
    enabled: Boolean(tokenId && chainId && enabled),
    keepPreviousData: true,
  })
}

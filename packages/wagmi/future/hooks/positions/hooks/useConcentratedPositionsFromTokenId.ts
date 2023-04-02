import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions'
import { ChainId } from '@sushiswap/chain'
import { BigNumber } from 'ethers'

interface UseConcentratedLiquidityPositionsFromTokenIdParams {
  tokenId: number | string | undefined
  chainId: ChainId
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

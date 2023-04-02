import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions'
import { ChainId } from '@sushiswap/chain'
import { BigNumber } from 'ethers'

interface UseConcentratedLiquidityPositionsFromTokenIdsParams {
  tokenIds: BigNumber[]
  chainId: ChainId
  enabled?: boolean
}

export const useConcentratedLiquidityPositionsFromTokenIds = ({
  chainId,
  tokenIds,
  enabled = true,
}: UseConcentratedLiquidityPositionsFromTokenIdsParams) => {
  return useQuery({
    queryKey: ['useConcentratedLiquidityPositionsFromTokenIds', { chainId, tokenIds }],
    queryFn: async () =>
      await getConcentratedLiquidityPositionsFromTokenIds({
        tokenIds: tokenIds.map((el) => ({ tokenId: el, chainId })),
      }),
    refetchInterval: 10000,
    enabled: Boolean(chainId && enabled),
  })
}

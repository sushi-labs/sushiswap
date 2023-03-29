import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions'
import { ChainId } from '@sushiswap/chain'
import { BigNumber } from 'ethers'

interface UseConcentratedLiquidityPositionsFromTokenIdsParams {
  tokenIds: BigNumber[]
  chainId: ChainId
  enabled?: boolean
}

export const useConcentratedLiquidityPositionsFromTokenIds = (
  variables: UseConcentratedLiquidityPositionsFromTokenIdsParams
) => {
  return useQuery({
    queryKey: [
      'useConcentratedLiquidityPositionsFromTokenIds',
      { chainId: variables.chainId, tokenIds: variables.tokenIds },
    ],
    queryFn: async () =>
      await getConcentratedLiquidityPositionsFromTokenIds({
        tokenIds: variables.tokenIds.map((el) => ({ tokenId: el, chainId: variables.chainId })),
      }),
    refetchInterval: 10000,
    enabled: Boolean(variables.enabled || true),
  })
}

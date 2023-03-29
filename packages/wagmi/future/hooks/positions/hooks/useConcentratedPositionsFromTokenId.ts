import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositionsFromTokenIds } from '../actions'
import { ChainId } from '@sushiswap/chain'
import { BigNumber } from 'ethers'

interface UseConcentratedLiquidityPositionsFromTokenIdParams {
  tokenId: number | string | undefined
  chainId: ChainId
  enabled?: boolean
}

export const useConcentratedLiquidityPositionsFromTokenId = (
  variables: UseConcentratedLiquidityPositionsFromTokenIdParams
) => {
  return useQuery({
    queryKey: [
      'useConcentratedLiquidityPositionsFromTokenIds',
      { chainId: variables.chainId, tokenIds: variables.tokenId },
    ],
    queryFn: async () => {
      const positions = await getConcentratedLiquidityPositionsFromTokenIds({
        tokenIds: [{ tokenId: BigNumber.from(variables.tokenId), chainId: variables.chainId }],
      })

      return positions[0]
    },
    refetchInterval: 10000,
    enabled: Boolean(variables.tokenId && variables.chainId) && Boolean(variables.enabled || true),
    keepPreviousData: true,
  })
}

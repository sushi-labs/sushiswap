import {
  type TokenListV2ChainId,
  getRecentSwaps,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

export const TempChainIds: TokenListV2ChainId[] = [1, 8453, 42161, 137]

interface UseRecentSwaps {
  walletAddress: Address | undefined
  chainIds: TokenListV2ChainId[] | undefined
}

export const useRecentSwaps = ({ walletAddress, chainIds }: UseRecentSwaps) => {
  return useQuery({
    queryKey: ['useRecentSwaps', walletAddress, chainIds],
    queryFn: async () => {
      if (!chainIds || !walletAddress) return []

      if (chainIds.some((chainId) => !isTokenListV2ChainId(chainId))) {
        return []
      }

      const data = await getRecentSwaps({
        account: walletAddress,
        chainIds: chainIds,
      })

      if (!data) return []

      return data.sort((a, b) => b.time - a.time)
    },
    refetchInterval: 60000,
    enabled: !!walletAddress && !!chainIds,
  })
}

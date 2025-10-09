import type { PoolChainId } from '@sushiswap/graph-client/data-api'
import { getPortfolioV2Tokens } from '@sushiswap/graph-client/data-api-portfolio'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { Address } from 'viem'

export const useWalletPositions = ({
  address,
  chainIds,
  refetchInterval = ms('1m'),
}: {
  address: Address | undefined
  chainIds: PoolChainId[]
  refetchInterval?: number
}) => {
  return useQuery({
    queryKey: ['wallet-positions', address, chainIds],
    queryFn: async () => {
      const data = await getPortfolioV2Tokens({
        address: address as `0x${string}`,
        chainIds,
      })
      return data
    },
    enabled: Boolean(address) && chainIds.length > 0,
    refetchInterval,
  })
}

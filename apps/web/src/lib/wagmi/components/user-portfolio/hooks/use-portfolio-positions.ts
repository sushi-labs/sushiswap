import { getPortfolioPositions } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

export const usePortfolioPositions = ({
  address,
  refetchInterval = 600_000,
}: {
  address: Address | undefined
  refetchInterval?: number
}) => {
  return useQuery({
    queryKey: ['portfolio-positions', address],
    queryFn: async () => {
      const id = address as string
      const data = await getPortfolioPositions({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

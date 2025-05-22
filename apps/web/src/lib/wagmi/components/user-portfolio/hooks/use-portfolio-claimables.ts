import { getPortfolioClaimables } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

export const usePortfolioClaimables = ({
  address,
  refetchInterval = 600_000,
}: {
  address: Address | undefined
  refetchInterval?: number
}) => {
  return useQuery({
    queryKey: ['portfolio-claimables', address],
    queryFn: async () => {
      const id = address as string
      const data = await getPortfolioClaimables({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

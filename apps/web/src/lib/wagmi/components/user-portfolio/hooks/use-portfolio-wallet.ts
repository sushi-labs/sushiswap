import { getPortfolioWallet } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

export const usePortfolioWallet = ({
  address,
  refetchInterval = 600_000,
}: {
  address: Address | undefined
  refetchInterval?: number
}) => {
  return useQuery({
    queryKey: ['portfolio-wallet', address],
    queryFn: async () => {
      const id = address as string
      const data = await getPortfolioWallet({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

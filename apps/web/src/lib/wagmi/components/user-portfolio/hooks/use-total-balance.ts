import {
  getPortfolioClaimables,
  getPortfolioPositions,
  getPortfolioWallet,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'

export const useTotalBalance = ({
  address,
  refetchInterval = 600_000,
}: {
  address: Address | undefined
  refetchInterval?: number
}) => {
  return useQuery({
    queryKey: ['total-balance', address],
    queryFn: async () => {
      const res = await Promise.all([
        getPortfolioWallet({ id: address as string }),
        getPortfolioPositions({ id: address as string }),
        getPortfolioClaimables({ id: address as string }),
      ])
      const walletData = res?.[0]
      const posData = res?.[1]
      const claimData = res?.[2]

      const totalUSD =
        (walletData?.totalUSD ?? 0) +
        (posData?.totalUSD ?? 0) +
        (claimData?.totalUSD ?? 0)

      return {
        totalUSD,
        percentageChange24h: walletData?.percentageChange24h ?? 0,
        amountUSD24Change: walletData?.amountUSD24Change ?? 0,
      }
    },
    enabled: !!address,
    refetchInterval,
  })
}

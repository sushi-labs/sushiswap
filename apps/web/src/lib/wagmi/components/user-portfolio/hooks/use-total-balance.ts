import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { usePortfolioClaimables } from './use-portfolio-claimables'
import { usePortfolioPositions } from './use-portfolio-positions'
import { usePortfolioWallet } from './use-portfolio-wallet'

export const useTotalBalance = (
  address: Address | undefined,
  refetchInterval?: 600_000,
) => {
  const { data: walletData, isFetched: walletFetched } =
    usePortfolioWallet(address)
  const { data: claimableData, isFetched: claimablesFetched } =
    usePortfolioClaimables(address)
  const { data: positionData, isFetched: positionsFetched } =
    usePortfolioPositions(address)

  const totalUSD = useMemo(() => {
    if (!walletData || !claimableData || !positionData) return 0

    const walletTotalUSD = walletData?.totalUSD ?? 0
    const claimableTotalUSD = claimableData?.totalUSD ?? 0
    const positionTotalUSD = positionData?.totalUSD ?? 0

    return walletTotalUSD + claimableTotalUSD + positionTotalUSD
  }, [walletData, claimableData, positionData])

  return useQuery({
    queryKey: ['total-balance', address],
    queryFn: () => {
      return {
        totalUSD,
        percentageChange24h: walletData?.percentageChange24h ?? 0,
        amountUSD24Change: walletData?.amountUSD24Change ?? 0,
      }
    },
    enabled:
      !!address && walletFetched && claimablesFetched && positionsFetched,
    refetchInterval,
  })
}

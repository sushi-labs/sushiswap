import { getPortfolioWallet } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PortfolioWalletTable } from './PortfolioWalletTable'
import { PortfolioWalletInfo } from './PortfolioWalletTotal'

function usePortfolioWallet(
  address: Address | undefined,
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-wallet', address],
    queryFn: async () => {
      if (!address) return null
      const id = address as string
      const data = await getPortfolioWallet({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

export const PortfolioWallet = () => {
  const id = useAccount()
  const { data, isLoading } = usePortfolioWallet(id.address)

  return (
    <>
      <PortfolioWalletInfo
        isLoading={isLoading}
        amountUSD24Change={data?.amountUSD24Change}
        totalUSD={data?.totalUSD}
        percentageChange24h={data?.percentageChange24h}
      />
      <PortfolioWalletTable isLoading={isLoading} data={data?.tokens ?? []} />
    </>
  )
}

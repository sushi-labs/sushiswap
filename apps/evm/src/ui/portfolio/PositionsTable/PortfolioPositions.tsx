import { getPortfolioPositions } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PortfolioPositionTable } from './PortfolioPositionTable'
import { PortfolioPositionInfo } from './PortfolioPositionTotal'

function usePortfolioPositions(
  address: Address | undefined,
  refetchInterval?: 600_000,
) {
  return useQuery({
    queryKey: ['portfolio-positions', address],
    queryFn: async () => {
      if (!address) return null
      const id = address as string
      const data = await getPortfolioPositions({ id })
      return data
    },
    enabled: !!address,
    refetchInterval,
  })
}

export const PortfolioPositions = () => {
  const id = useAccount()
  const { data, isLoading } = usePortfolioPositions(id.address)

  return (
    <>
      <PortfolioPositionInfo isLoading={isLoading} totalUSD={data?.totalUSD} />
      <PortfolioPositionTable
        isLoading={isLoading}
        data={data ? [...data.v2Positions, ...data.v3Positions] : []}
      />
    </>
  )
}

import { getPortfolioPositions } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PortfolioPositionInfo } from './PortfolioPositionTotal'
import { PortfolioV2PositionTable } from './v2/PortfolioV2PositionTable'
import { PortfolioV3PositionTable } from './v3/PortfolioV3PositionTable'

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
      <PortfolioV3PositionTable
        isLoading={isLoading}
        data={data ? data.v3Positions : []}
      />
      <PortfolioV2PositionTable
        isLoading={isLoading}
        data={data ? data.v2Positions : []}
      />
    </>
  )
}

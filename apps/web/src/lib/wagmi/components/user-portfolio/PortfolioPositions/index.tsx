import { getPortfolioPositions } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { PortfolioPositionsInfo } from './PortfolioPositionsTotal'
import { PortfolioV2PositionsTable } from './v2/PortfolioV2PositionsTable'
import { PortfolioV3PositionsTable } from './v3/PortfolioV3PositionsTable'

function usePortfolioPositions(
  address: Address | undefined,
  refetchInterval?: 600_000,
) {
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

export const PortfolioPositions = () => {
  const id = useAccount()
  const { data, isLoading } = usePortfolioPositions(id.address)

  return (
    <div className="gap-y-20">
      <PortfolioPositionsInfo isLoading={isLoading} totalUSD={data?.totalUSD} />
      <PortfolioV3PositionsTable
        isLoading={isLoading}
        data={data?.v3Positions}
      />
      <PortfolioV2PositionsTable
        isLoading={isLoading}
        data={data?.v2Positions}
      />
    </div>
  )
}

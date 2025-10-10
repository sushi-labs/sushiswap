import { getPortfolioV2Chart } from '@sushiswap/graph-client/data-api-portfolio'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { Address } from 'viem'
import { useChartFilters } from '~evm/[chainId]/portfolio/chart-filters-provider'

export const usePortfolioChart = ({
  address,
}: {
  address: Address | undefined
}) => {
  const { chartNetworks, chartRange } = useChartFilters()

  return useQuery({
    queryKey: ['portfolio-chart', address, chartNetworks, chartRange],
    queryFn: async () => {
      const data = await getPortfolioV2Chart({
        address: address as `0x${string}`,
        chainIds: chartNetworks,
        range: chartRange,
      })
      return data
    },
    enabled: Boolean(address) && Boolean(chartNetworks?.length),
    refetchInterval: ms('5m'),
    staleTime: ms('5m'),
  })
}

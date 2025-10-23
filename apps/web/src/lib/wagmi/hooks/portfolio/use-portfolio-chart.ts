import { getPortfolioV2Chart } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { Address } from 'viem'
import { useChartFilters } from '~evm/[chainId]/portfolio/chart-filters-provider'

export const usePortfolioChart = ({
  address,
}: {
  address: Address | undefined
}) => {
  const { chartNetworks, chartRange, asset } = useChartFilters()

  return useQuery({
    queryKey: [
      'portfolio-chart',
      address,
      chartNetworks,
      chartRange,
      asset?.id,
    ],
    queryFn: async () => {
      const data = await getPortfolioV2Chart({
        address: address as `0x${string}`,
        chainIds: chartNetworks,
        range: chartRange,
        ...(asset
          ? {
              tokenFilter: {
                address: asset.wrap().address,
                chainId: asset.chainId,
              },
            }
          : {}),
      })
      return data
    },
    enabled: Boolean(address) && Boolean(chartNetworks?.length),
    refetchInterval: ms('5m'),
    staleTime: ms('5m'),
  })
}

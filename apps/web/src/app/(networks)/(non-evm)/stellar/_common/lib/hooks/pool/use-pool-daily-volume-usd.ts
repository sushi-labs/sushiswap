import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useTopPools } from './use-top-pools'

export const useDayVolumeUSD = ({ pairAddress }: { pairAddress?: string }) => {
  const { data: topPools, isLoading, isPending } = useTopPools()
  return useQuery({
    queryKey: ['stellar', 'useDayVolumeUSD', pairAddress],
    queryFn: async () => {
      if (!pairAddress || !topPools) {
        return '0'
      }
      const topPool = topPools.find((pool) => pool.address === pairAddress)
      return topPool?.volumeUSD1d?.toString() ?? '0'
    },
    placeholderData: keepPreviousData,
    enabled: !!pairAddress && !!topPools && !isLoading && !isPending,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: ms('15 minutes'),
  })
}

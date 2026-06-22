import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useStellarPools } from './use-stellar-pools'

export const useDayVolumeUSD = ({ pairAddress }: { pairAddress?: string }) => {
  const { data: stellarPools, isLoading, isPending } = useStellarPools()
  return useQuery({
    queryKey: ['stellar', 'useDayVolumeUSD', pairAddress],
    queryFn: async () => {
      if (!pairAddress || !stellarPools) {
        return '0'
      }
      const stellarPool = stellarPools.find(
        (pool) => pool.address.toLowerCase() === pairAddress.toLowerCase(),
      )
      return stellarPool?.volumeUSD1d?.toString() ?? '0'
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(pairAddress && stellarPools && !isLoading && !isPending),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: ms('15m'),
  })
}

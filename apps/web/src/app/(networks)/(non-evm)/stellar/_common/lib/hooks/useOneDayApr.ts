import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'

const getTradeAmountsForDay = async (_pairAddress: string) => {
  try {
    // TODO(@wu-benjamin): implement for Stellar
    throw new Error('Function not implemented yet for Stellar')
  } catch (error) {
    console.log(error)
    return []
  }
}

const calculateDailyVolume = (tradeAmounts: number[]) => {
  const totalVolume = tradeAmounts.reduce(
    (acc, tradeAmount) => acc + tradeAmount,
    0,
  )
  return totalVolume
}

export const useDayVolumeUSD = ({ pairAddress }: { pairAddress?: string }) => {
  return useQuery({
    queryKey: ['useDayVolumeUSD', pairAddress],
    queryFn: async () => {
      if (!pairAddress) return '0'
      try {
        const tradeAmountsForDay = await getTradeAmountsForDay(pairAddress)
        const dailyVolume = calculateDailyVolume(tradeAmountsForDay)
        return dailyVolume
      } catch (e) {
        console.log(e)
        return '0'
      }
    },
    placeholderData: keepPreviousData,
    enabled: !!pairAddress,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: ms('15 minutes'),
  })
}

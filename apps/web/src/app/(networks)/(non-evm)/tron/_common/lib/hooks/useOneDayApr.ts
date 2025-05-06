import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { IGetTradeAmountsForDayResponse } from '~tron/_common/types/get-pools-type'

const getTradeAmountsForDay = async (pairAddress: string) => {
  try {
    const res = await fetch(
      `/tron/api/pools/get-volume?pairAddress=${pairAddress}`,
      {
        method: 'GET',
      },
    )
    if (!res.ok) {
      throw new Error('Failed to fetch data from Tron API')
    }
    const data = (await res.json()) as IGetTradeAmountsForDayResponse
    const tradeAmounts = data?.data?.tron.dexTrades.map((trade) => {
      return trade.tradeAmount
    })
    return tradeAmounts
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

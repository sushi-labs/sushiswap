import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { Fraction } from 'sushi/math'
import { parseUnits } from 'viem'

interface UsePrice {
  chainId: number | undefined
  address: string | undefined
}

export const usePrice = ({ chainId, address }: UsePrice) => {
  return useQuery({
    queryKey: [`/api/price/v2/${chainId}/${address}`],
    queryFn: async () => {
      const data = await fetch(
        `/api/price/v2/${chainId}/${address}`,
        // `http://localhost:3001/v2/${chainId}/${address}`,
      ).then((response) => response.json())
      return new Fraction(
        parseUnits(data.toFixed(18), 18).toString(),
        parseUnits('1', 18).toString(),
      )
    },
    enabled: Boolean(chainId && address),
    staleTime: ms('15s'),
    cacheTime: ms('1m'),
    // staleTime: 900000, // 15 mins
    // cacheTime: 3600000, // 1hr
    refetchOnWindowFocus: false,
  })
}

import { useQuery } from '@tanstack/react-query'
import { Fraction } from 'sushi/math'
import { getAddress, isAddress, parseUnits } from 'viem'

interface UsePrices {
  chainId: number | undefined
}

export const usePrices = ({ chainId }: UsePrices) => {
  return useQuery({
    queryKey: [`https://token-price.sushi.com/v1/${chainId}`],
    queryFn: async () => {
      const data: Record<string, number> = await fetch(
        `https://token-price.sushi.com/v1/${chainId}`,
        // `http://localhost:3001/v2/${chainId}`,
      ).then((response) => response.json())
      return Object.entries(data).reduce<Record<string, Fraction>>(
        (acc, [address, price]) => {
          if (isAddress(address)) {
            acc[getAddress(address)] = new Fraction(
              parseUnits(price.toFixed(18), 18).toString(),
              parseUnits('1', 18).toString(),
            )
          }

          return acc
        },
        {},
      )
    },
    staleTime: 900000, // 15 mins
    cacheTime: 3600000, // 1hr
    refetchOnWindowFocus: false,
    enabled: Boolean(chainId),
  })
}

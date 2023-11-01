import { useQuery } from '@tanstack/react-query'
import { Fraction } from 'sushi/math'
import { getAddress, isAddress, parseUnits } from 'viem'

const hydrate = (data: Record<string, number>) => {
  return Object.entries(data).reduce<Record<string, Record<string, Fraction>>>(
    (acc, [chainId, addresses]) => {
      acc[chainId] = Object.entries(addresses).reduce<Record<string, Fraction>>(
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

      return acc
    },
    {},
  )
}

export const useAllPrices = () => {
  return useQuery({
    queryKey: ['https://token-price.sushi.com/v1'],
    queryFn: async () =>
      fetch('https://token-price.sushi.com/v1').then((response) =>
        response.json(),
      ),
    staleTime: 900000, // 15 mins
    cacheTime: 3600000, // 1hr
    refetchOnWindowFocus: false,
    select: hydrate,
  })
}

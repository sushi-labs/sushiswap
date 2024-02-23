import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
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
    queryKey: ['/api/price'],
    queryFn: async () =>
      fetch('/api/price').then((response) => response.json()),
    staleTime: ms('60s'),
    cacheTime: ms('1h'),
    refetchOnWindowFocus: false,
    select: hydrate,
  })
}

import { getAddress, isAddress } from '@ethersproject/address'
import { parseUnits } from '@ethersproject/units'
import { Fraction } from '@sushiswap/math'
import { useQuery } from '@tanstack/react-query'

interface UsePrices {
  chainId: number | undefined
}

const hydrate = (data: Record<string, number>) => {
  return Object.entries(data).reduce<Record<string, Fraction>>((acc, [address, price]) => {
    if (isAddress(address)) {
      acc[getAddress(address)] = new Fraction(
        parseUnits(price.toFixed(18), 18).toString(),
        parseUnits('1', 18).toString()
      )
    }

    return acc
  }, {})
}

export const usePrices = ({ chainId }: UsePrices) => {
  return useQuery({
    queryKey: [`https://token-price.sushi.com/v0/${chainId}`],
    queryFn: async () => fetch(`https://token-price.sushi.com/v0/${chainId}`).then((response) => response.json()),
    staleTime: 900000, // 15 mins
    cacheTime: 3600000, // 1hr
    refetchOnWindowFocus: false,
    enabled: Boolean(chainId),
    select: hydrate,
  })
}

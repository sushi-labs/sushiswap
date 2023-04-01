import { parseUnits } from '@ethersproject/units'
import { Fraction } from '@sushiswap/math'
import { useQuery } from '@tanstack/react-query'

interface UsePrice {
  chainId: number | undefined
  address: string | undefined
}

const hydrate = (data: number) => {
  return new Fraction(parseUnits(data.toFixed(18), 18).toString(), parseUnits('1', 18).toString())
}

export const usePrice = ({ chainId, address }: UsePrice) => {
  return useQuery({
    queryKey: ['NoPersist', `https://token-price.sushi.com/v1/${chainId}/${address}`],
    queryFn: async () =>
      fetch(`https://token-price.sushi.com/v1/${chainId}/${address}`).then((response) => response.json()),
    enabled: Boolean(chainId && address),
    select: hydrate,
    staleTime: 900000, // 15 mins
    cacheTime: 3600000, // 1hr
    refetchOnWindowFocus: false,
  })
}

import { useQuery } from '@tanstack/react-query'
import { Fraction } from '@sushiswap/math'
import { parseUnits } from '@ethersproject/units'

interface UsePrice {
  chainId: number | undefined
  address: string | undefined
}

const hydrate = (data: number) => {
  return new Fraction(parseUnits(data.toFixed(18), 18).toString(), parseUnits('1', 18).toString())
}

export const usePrice = ({ chainId, address }: UsePrice) => {
  return useQuery({
    queryKey: [`token-price.sushi.com/v1/${chainId}/${address}`],
    queryFn: async () =>
      fetch(`https://token-price.sushi.com/v1/${chainId}/${address}`).then((response) => response.json()),
    staleTime: 20000,
    enabled: Boolean(chainId && address),
    select: hydrate,
  })
}

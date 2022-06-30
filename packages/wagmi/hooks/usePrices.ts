import { getAddress, isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Fraction } from '@sushiswap/math'
import { parseUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { UseQueryOptions } from 'react-query'
import { useQuery } from 'wagmi'

function toFixed(num: number, fixed: number): string {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
  return num.toString().match(re)?.[0] as string
}

type UsePrices = ({
  chainId,
  options,
}: {
  chainId?: ChainId
  options?: UseQueryOptions<string, unknown, Record<string, number> | undefined, string[]>
}) => Pick<ReturnType<typeof useQuery>, 'isLoading' | 'isError'> & { data: Record<string, Fraction> | undefined }

export const usePrices: UsePrices = ({ chainId, options }) => {
  const queryKey = useMemo(() => [`https://token-price.sushi.com/v0/${chainId}`], [chainId])

  const {
    data: pricesMap,
    isError,
    isLoading,
  } = useQuery<string, unknown, Record<string, number> | undefined, string[]>(
    queryKey,
    () => fetch(`https://token-price.sushi.com/v0/${chainId}`).then((response) => response.json()),
    { staleTime: 20000, ...options }
  )

  return useMemo(() => {
    return {
      isError,
      isLoading,
      data:
        pricesMap && !isError && !isLoading
          ? Object.entries(pricesMap).reduce<Record<string, Fraction>>((acc, [address, price]) => {
              if (isAddress(address)) {
                acc[getAddress(address)] = new Fraction(
                  parseUnits(toFixed(price, 18), 18).toString(),
                  parseUnits('1', 18).toString()
                )
              }

              return acc
            }, {})
          : undefined,
    }
  }, [isError, isLoading, pricesMap])
}

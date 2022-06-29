import { getAddress, isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Fraction } from '@sushiswap/math'
import { parseUnits } from 'ethers/lib/utils'
import { useQuery } from 'wagmi'

function toFixed(num: number, fixed: number): string {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
  return num.toString().match(re)?.[0] as string
}

type UsePrices = ({
  chainId,
}: {
  chainId?: ChainId
}) => Omit<ReturnType<typeof useQuery>, 'data'> & { data: Record<string, Fraction> | undefined }

export const usePrices: UsePrices = ({ chainId }) => {
  const { data: pricesMap, ...rest } = useQuery<Record<string, number>>(
    [`https://token-price.sushi.com/v0/${chainId}`],
    () => fetch(`https://token-price.sushi.com/v0/${chainId}`).then((response) => response.json())
  )

  return {
    ...rest,
    data:
      pricesMap && !rest.isError && !rest.isLoading
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
}

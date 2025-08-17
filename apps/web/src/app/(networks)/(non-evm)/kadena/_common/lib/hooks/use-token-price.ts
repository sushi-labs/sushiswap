import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { STABLE_TOKENS } from '~kadena/_common/constants/token-list'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { getKdaPrice } from './use-kda-price'

type TokenPriceResponse = {
  success: boolean
  data: {
    priceUsd: number
  }
}

const getTokenPrice = async (tokenAddress: string) => {
  const url = new URL(`/kadena/api/tokens/price`, window.location.origin)
  url.searchParams.set('tokenAddress', tokenAddress)

  const res = await fetch(url.toString())
  const data: TokenPriceResponse = await res.json()

  return data?.data?.priceUsd ?? 0
}

const getPrice = async (token: KadenaToken | undefined) => {
  //if token is undefined return 0
  if (!token) return 0

  //if token in STABLE_TOKENS return 1
  if (
    STABLE_TOKENS.find(
      (stableToken) =>
        stableToken.tokenAddress?.toLowerCase() ===
        token.tokenAddress?.toLowerCase(),
    )
  ) {
    return 1
  }

  //if native coin, return native usd price
  const isNative = token.tokenAddress?.toLowerCase() === 'coin'

  if (isNative) {
    const kdaInUsd = await getKdaPrice()
    return kdaInUsd.priceUsd
  }

  const tokenAddress = token.tokenAddress
  const tokenPrice = await getTokenPrice(tokenAddress)
  if (tokenPrice) {
    return tokenPrice
  }

  //a usd price is not available
  return 0
}

export const useTokenPrice = ({
  token,
}: { token: KadenaToken | undefined }) => {
  return useQuery({
    queryKey: ['use-token-price', { token: token?.tokenAddress }],
    queryFn: async () => {
      if (!token || !token.tokenAddress) {
        return 0
      }
      const tokenPrice = await getPrice(token)

      return tokenPrice
    },
    placeholderData: keepPreviousData,
    enabled: !!token,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

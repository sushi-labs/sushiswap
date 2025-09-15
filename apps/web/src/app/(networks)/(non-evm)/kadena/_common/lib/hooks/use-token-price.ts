import { getTokenPrice } from '@sushiswap/graph-client/kadena'
import { useQuery } from '@tanstack/react-query'
import type { KvmToken } from 'sushi/kvm'
import { STABLE_TOKENS } from '~kadena/_common/constants/token-list'
import { getKdaPrice } from './use-kda-price'

const getPrice = async (token: KvmToken | undefined) => {
  //if token is undefined return 0
  if (!token) return 0

  //if token in STABLE_TOKENS return 1
  if (STABLE_TOKENS.find((stableToken) => stableToken.isSame(token))) {
    return 1
  }

  //if native coin, return native usd price
  const isNative = token.address?.toLowerCase() === 'coin'

  if (isNative) {
    const kdaInUsd = await getKdaPrice()
    return kdaInUsd.priceUsd
  }

  const tokenAddress = token.address
  const tokenPrice = await getTokenPrice({ tokenAddress })

  return tokenPrice?.priceInUsd ?? 0
}

export const useTokenPrice = ({ token }: { token: KvmToken | undefined }) => {
  return useQuery({
    queryKey: ['use-token-price-kadena', { token: token?.address }],
    queryFn: async () => {
      if (!token || !token.address) {
        return 0
      }
      const tokenPrice = await getPrice(token)

      return tokenPrice
    },
    enabled: !!token,
  })
}

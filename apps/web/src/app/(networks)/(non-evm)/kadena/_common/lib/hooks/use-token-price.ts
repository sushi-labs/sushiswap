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
  console.log('swag, tokenPrice', tokenPrice)

  return tokenPrice?.priceInUsd ?? 0
}

export const useTokenPrice = ({
  token,
  enabled = true,
}: { token: KvmToken | undefined; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['use-token-price-kadena', { token: token?.address }],
    queryFn: async () => {
      if (!token) {
        throw new Error('Token address is required')
      }

      console.log('tokeninput calling getPrice')
      const tokenPrice = await getPrice(token)
      console.log('tokeninput useTokenPrice res', tokenPrice)
      return tokenPrice
    },
    enabled: Boolean(token) && enabled,
  })
}

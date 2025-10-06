import { useQuery } from '@tanstack/react-query'
import type { KvmToken } from 'sushi/kvm'
import { z } from 'zod'
import { STABLE_TOKENS } from '~kadena/_common/constants/token-list'
import { getKdaPrice } from './use-kda-price'

const tokenPriceResponseSchema = z.object({
  token: z.object({
    name: z.string(),
    chainId: z.string(),
    id: z.string(),
    address: z.string(),
  }),
  protocolAddress: z.string(),
  priceInUsd: z.number(),
  priceInKda: z.number(),
  id: z.string(),
})

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
  const url = new URL('/kadena/api/price', window.location.origin)
  url.searchParams.set('tokenAddress', tokenAddress)

  const res = await fetch(url.toString())
  const data = await res.json()

  const parsed = tokenPriceResponseSchema.safeParse(data)

  if (!parsed.success) {
    throw new Error('Failed to parse token price')
  }
  const tokenPrice = parsed.data.priceInUsd

  return tokenPrice ?? 0
}

export const useTokenPrice = ({
  token,
  enabled = true,
}: {
  token: KvmToken | undefined
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['use-token-price-kadena', { token: token?.address }],
    queryFn: async () => {
      if (!token) {
        throw new Error('Token address is required')
      }

      const tokenPrice = await getPrice(token)
      return tokenPrice
    },
    enabled: Boolean(token && enabled),
  })
}

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStablePrice } from '~stellar/_common/lib/hooks/price/get-stable-price'
import type { Token } from '~stellar/_common/lib/types/token.type'

export const useStablePrice = ({ token }: { token: Token | undefined }) => {
  return useQuery({
    queryKey: ['stellar', 'useStablePrice', { token: token?.contract }],
    queryFn: async () => {
      const tokenPrice = await getStablePrice(token)
      return tokenPrice
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(token),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

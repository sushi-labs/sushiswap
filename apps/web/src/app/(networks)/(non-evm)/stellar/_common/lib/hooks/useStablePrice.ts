import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Token } from '../types/token.type'

const getTokenPrice = async (_token: Token | undefined): Promise<string> => {
  try {
    // TODO(@wu-benjamin): implement for Stellar
    // drew uses hard-coded 0.12 for xlm and 0.05 for other tokens
    // in pool-helpers.ts
    throw new Error('Function not implemented yet for Stellar')
  } catch (error) {
    console.log(error)
    return '0'
  }
}

export const useStablePrice = ({ token }: { token: Token | undefined }) => {
  return useQuery({
    queryKey: ['useStablePrice', { token: token?.contract }],
    queryFn: async () => {
      const tokenPrice = await getTokenPrice(token)

      return tokenPrice
    },
    placeholderData: keepPreviousData,
    enabled: !!token,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

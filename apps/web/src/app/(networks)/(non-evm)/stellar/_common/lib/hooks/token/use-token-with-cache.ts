import { useQuery } from '@tanstack/react-query'
import { getTokenByContract } from '../../soroban'
import { useCustomTokens } from './use-custom-tokens'

interface UseTokenParams {
  address: string
  enabled?: boolean
  keepPreviousData?: boolean
}

export function useTokenWithCache({
  address,
  enabled = true,
  keepPreviousData = true,
}: UseTokenParams) {
  const { data: customTokens } = useCustomTokens()

  return useQuery({
    queryKey: ['stellar', 'tokenWithCache', { address }],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address is required')
      }

      const cachedToken = customTokens[address.toUpperCase()]
      if (cachedToken) {
        return cachedToken
      }

      return getTokenByContract(address)
    },
    enabled: Boolean(enabled && address),
    refetchOnWindowFocus: false,
    placeholderData: (prevData) => (keepPreviousData ? prevData : undefined),
    retry: false,
  })
}

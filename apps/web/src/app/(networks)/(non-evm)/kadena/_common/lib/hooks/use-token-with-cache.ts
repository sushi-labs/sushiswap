import { useQuery } from '@tanstack/react-query'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { useCustomTokens } from './use-custom-tokens'

interface GetTokenWithQueryCacheFn {
  address: string
  hasToken: (currency: string | KadenaToken) => boolean
  customTokens: Record<string, KadenaToken>
}

export async function getTokenDetails({
  address,
  hasToken,
  customTokens,
}: GetTokenWithQueryCacheFn) {
  if (hasToken(address)) {
    const { tokenAddress, name, tokenSymbol, tokenDecimals } =
      customTokens[`${address}`]
    return {
      tokenAddress,
      name,
      tokenSymbol,
      tokenDecimals,
    }
  }

  const response = await fetch(`/api/kadena/token-info?tokenAddress=${address}`)

  if (response.status === 200) {
    const data = await response.json()

    return data.data
  }

  return undefined
}

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
  const { customTokens, hasToken } = useCustomTokens()

  return useQuery({
    queryKey: ['token', { address }],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address is required')
      }

      return getTokenDetails({ address, hasToken, customTokens })
    },
    enabled: Boolean(enabled && address),
    refetchOnWindowFocus: false,
    placeholderData: (prevData) => (keepPreviousData ? prevData : undefined),
    retry: false,
  })
}

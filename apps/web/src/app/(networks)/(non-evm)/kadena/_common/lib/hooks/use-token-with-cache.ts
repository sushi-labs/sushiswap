import { useQuery } from '@tanstack/react-query'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { buildGetTokenMetaTx } from '../pact/builders'
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
    const { tokenAddress, tokenName, tokenSymbol, tokenDecimals } =
      customTokens[address]
    return { tokenAddress, tokenName, tokenSymbol, tokenDecimals }
  }

  const tx = buildGetTokenMetaTx(address, KADENA_CHAIN_ID, KADENA_NETWORK_ID)

  const res = await kadenaClient.local(tx, {
    preflight: false,
    signatureVerification: false,
  })

  if (res.result.status !== 'success') {
    throw new Error(
      res.result.error?.message || 'Failed to fetch token metadata',
    )
  }

  console.log('getTokenDetails', res.result.data)

  const { name, symbol, decimals } = res.result.data

  return {
    tokenAddress: address,
    tokenName: name,
    tokenSymbol: symbol,
    tokenDecimals: decimals,
  }
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

import { PactNumber } from '@kadena/pactjs'
import { useQuery } from '@tanstack/react-query'
import {
  KvmChainId,
  KvmToken,
  type KvmTokenAddress,
  isKvmTokenAddress,
} from 'sushi/kvm'
import { kadenaClient } from '~kadena/_common/constants/client'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { buildGetTokenPrecision } from '../pact/builders'
import { useCustomTokens } from './use-custom-tokens'

interface GetTokenWithQueryCacheFn {
  address: KvmTokenAddress
  hasToken: (currency: KvmTokenAddress | KvmToken) => boolean
  customTokens: Record<KvmTokenAddress, KvmToken>
}

export async function getTokenDetails({
  address,
  hasToken,
  customTokens,
}: GetTokenWithQueryCacheFn) {
  if (hasToken(address)) {
    const kvmToken = customTokens[address]
    return kvmToken
  }

  if (!isKvmTokenAddress(address)) {
    throw new Error('Invalid KVM Token address')
  }

  const decimalsTx = buildGetTokenPrecision(address)

  const decimalRes = await kadenaClient.local(decimalsTx, {
    preflight: false,
    signatureVerification: false,
  })
  if (decimalRes.result.status !== 'success') {
    throw new Error(
      decimalRes.result.error?.message || 'Failed to fetch token decimals',
    )
  }
  const decimals = new PactNumber(
    decimalRes?.result?.data as { int: string },
  ).toNumber()

  const symbol = address?.split('.')?.[1] || 'UNKNOWN'

  return new KvmToken({
    chainId: KvmChainId.KADENA,
    address,
    symbol,
    decimals,
    name: symbol,
    metadata: {
      imageUrl: undefined,
      validated: false,
      kadenaChainId: KADENA_CHAIN_ID,
      kadenaNetworkId: KADENA_NETWORK_ID,
    },
  })
}
interface UseTokenParams {
  address: KvmTokenAddress
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
    queryKey: ['token-kadena', { address }],
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

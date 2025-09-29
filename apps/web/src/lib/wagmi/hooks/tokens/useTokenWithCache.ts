import {
  getTokenList,
  isTokenListChainId,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getToken as getTokenWeb3 } from '@wagmi/core/actions'
import { useCallback } from 'react'
import { getIdFromChainIdAddress } from 'sushi'
import { type EvmChainId, type EvmID, EvmToken } from 'sushi/evm'
import { type Address, isAddress } from 'viem'
import { useConfig } from 'wagmi'
import type { PublicWagmiConfig } from '../../config/public'

interface UseTokenParams {
  chainId: EvmChainId | undefined
  address: Address | undefined
  enabled?: boolean
  keepPreviousData?: boolean
}

type UseTokenReturn = EvmToken

export const getTokenWithQueryCacheHydrate = (
  chainId: EvmChainId | undefined,
  data: EvmToken<{ approved: boolean }> | undefined,
): UseTokenReturn | undefined => {
  if (data && chainId) {
    return data
  }

  return undefined
}

interface GetTokenWithQueryCacheFn {
  chainId: EvmChainId | undefined
  address: Address | undefined | null
  customTokens: Record<string, EvmToken<{ approved: boolean }>>
  hasToken: (cur: string | EvmToken) => boolean
  config: PublicWagmiConfig
}

export const getTokenWithCacheQueryFn = async ({
  chainId,
  address,
  customTokens,
  hasToken,
  config,
}: GetTokenWithQueryCacheFn): Promise<EvmToken<{ approved: boolean }>> => {
  if (!chainId) {
    throw Error('chainId is required')
  }

  if (!address) {
    throw Error('address is required')
  }

  // Try fetching from localStorage
  if (hasToken(getIdFromChainIdAddress(chainId, address))) {
    console.log(customTokens)
    return customTokens[getIdFromChainIdAddress(chainId, address)]
  }

  if (isTokenListChainId(chainId)) {
    try {
      const [token] = await getTokenList({ chainId, search: address })
      if (token)
        return new EvmToken({
          ...token,
          metadata: { approved: token.approved },
        })
    } catch {}
  }

  try {
    const resp = await getTokenWeb3(config, {
      address: address as Address,
      chainId,
    })
    const { decimals, address: tokenAddress, symbol, name } = resp

    return new EvmToken({
      chainId,
      address: tokenAddress,
      name: name || '',
      symbol: symbol || '',
      decimals,
      metadata: {
        approved: false,
      },
    })
  } catch {
    throw Error('Could not fetch token')
  }
}

export const useTokenWithCache = ({
  chainId,
  address,
  enabled = true,
  keepPreviousData: isKeepPreviousData = true,
}: UseTokenParams) => {
  console.log('inside useTokenWithCache', {
    chainId,
    address,
    enabled,
    isKeepPreviousData,
  })
  const { data: customTokens, hasToken } = useCustomTokens()
  const select = useCallback(
    (data: EvmToken<{ approved: boolean }>) =>
      getTokenWithQueryCacheHydrate(chainId, data),
    [chainId],
  )

  const config = useConfig()

  return useQuery({
    queryKey: ['token', { chainId, address }],
    queryFn: async () =>
      getTokenWithCacheQueryFn({
        chainId,
        address,
        customTokens,
        hasToken,
        config,
      }),
    enabled: Boolean(enabled && chainId && address && isAddress(address)),
    select,
    placeholderData: isKeepPreviousData ? keepPreviousData : undefined,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  })
}

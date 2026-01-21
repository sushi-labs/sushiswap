import {
  type TokenList,
  getTokenList,
  isTokenListChainId,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { logger } from 'src/lib/logger'
import { getIdFromChainIdAddress } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  EvmToken,
  isEvmAddress,
  isEvmChainId,
} from 'sushi/evm'
import {
  type SvmChainId,
  SvmToken,
  isSvmAddress,
  isSvmChainId,
} from 'sushi/svm'
import { useConfig } from 'wagmi'
import { getToken } from '../../actions/getToken'
import type { PublicWagmiConfig } from '../../config/public'

async function getEvmToken(
  chainId: EvmChainId,
  address: EvmAddress,
  config: PublicWagmiConfig,
) {
  const resp = await getToken(config, {
    address,
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
}

interface GetTokenWithQueryCacheFn<TChainId extends EvmChainId | SvmChainId> {
  chainId: TChainId | undefined
  address: AddressFor<TChainId> | undefined | null
  customTokens: Record<
    string,
    TokenFor<EvmChainId | SvmChainId, { approved: boolean }>
  >
  hasToken: (cur: string | TokenFor<TChainId>) => boolean
  config: PublicWagmiConfig
}

export async function getTokenWithCacheQueryFn<
  TChainId extends EvmChainId | SvmChainId,
>({
  chainId,
  address,
  customTokens,
  hasToken,
  config,
}: GetTokenWithQueryCacheFn<TChainId>): Promise<
  TokenFor<TChainId, { approved: boolean }>
> {
  if (!chainId) {
    throw Error('chainId is required')
  }

  if (!address) {
    throw Error('address is required')
  }

  // Try fetching from localStorage
  if (hasToken(getIdFromChainIdAddress(chainId, address))) {
    return customTokens[getIdFromChainIdAddress(chainId, address)] as TokenFor<
      TChainId,
      { approved: boolean }
    >
  }

  if (isTokenListChainId(chainId)) {
    try {
      const [token] = await getTokenList({
        chainId,
        search: address,
      })
      if (token) {
        if (isEvmChainId(chainId)) {
          const _token = token as TokenList<typeof chainId>[number]
          return new EvmToken({
            ..._token,
            metadata: { approved: _token.approved },
          }) as TokenFor<TChainId, { approved: boolean }>
        }

        if (isSvmChainId(chainId)) {
          const _token = token as TokenList<typeof chainId>[number]
          return new SvmToken({
            ..._token,
            metadata: { approved: _token.approved },
          }) as TokenFor<TChainId, { approved: boolean }>
        }
      }
    } catch (error) {
      logger.error(error, {
        location: 'useTokenWithCache',
        action: 'fetchTokenList',
        token_chain_id: chainId,
        token_address: address,
      })
    }
  }

  try {
    // Solana is supported under TokenListChainId, we can rely on data-api
    if (isEvmChainId(chainId)) {
      return (await getEvmToken(
        chainId,
        address as EvmAddress,
        config,
      )) as TokenFor<TChainId, { approved: boolean }>
    }
  } catch (error) {
    logger.error(error, {
      location: 'useTokenWithCache',
      action: 'fetchTokenRpc',
      token_chain_id: chainId,
      token_address: address,
    })
  }

  throw Error('Could not fetch token')
}

interface UseTokenParams<TChainId extends EvmChainId | SvmChainId> {
  chainId: TChainId | undefined
  address: AddressFor<TChainId> | undefined
  enabled?: boolean
  keepPreviousData?: boolean
}

type UseTokenReturn<TChainId extends EvmChainId | SvmChainId> =
  TokenFor<TChainId>

export function getTokenWithQueryCacheHydrate<
  TChainId extends EvmChainId | SvmChainId,
>(
  chainId: TChainId | undefined,
  data: TokenFor<TChainId> | undefined,
): UseTokenReturn<TChainId> | undefined {
  if (data && chainId) {
    return data
  }

  return undefined
}

export function useTokenWithCache<TChainId extends EvmChainId | SvmChainId>({
  chainId,
  address,
  enabled = true,
  keepPreviousData: isKeepPreviousData = true,
}: UseTokenParams<TChainId>) {
  const { data: customTokens, hasToken } = useCustomTokens()
  const select = useCallback(
    (data: TokenFor<TChainId, { approved: boolean }>) =>
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
    enabled: Boolean(
      enabled &&
        chainId &&
        address &&
        (isEvmAddress(address) || isSvmAddress(address)),
    ),
    select,
    placeholderData: isKeepPreviousData ? keepPreviousData : undefined,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
  })
}

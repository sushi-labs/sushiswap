import {
  getTokenList,
  isTokenListChainId,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getToken as getTokenWeb3 } from '@wagmi/core/actions'
import { useCallback } from 'react'
import type { ID } from 'sushi'
import { EvmChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { Address, getAddress, isAddress } from 'viem'
import { useConfig } from 'wagmi'
import { PublicWagmiConfig } from '../../config/public'

interface UseTokenParams {
  chainId: EvmChainId | undefined
  address: Address | undefined
  enabled?: boolean
  keepPreviousData?: boolean
}

type UseTokenReturn = Token

type Data = {
  id: ID
  address: Address
  name: string
  symbol: string
  decimals: number
  approved: boolean
}

export const getTokenWithQueryCacheHydrate = (
  chainId: EvmChainId | undefined,
  data: Data,
): UseTokenReturn | undefined => {
  if (data && chainId) {
    const { address, name, symbol, decimals, approved } = data
    const token = new Token({
      chainId,
      name,
      decimals,
      symbol,
      address,
      approved,
    })

    return token
  }

  return undefined
}

interface GetTokenWithQueryCacheFn {
  chainId: EvmChainId | undefined
  address: Address | undefined | null
  customTokens: Record<string, Token>
  hasToken: (cur: string | Token) => boolean
  config: PublicWagmiConfig
}

export const getTokenWithCacheQueryFn = async ({
  chainId,
  address,
  customTokens,
  hasToken,
  config,
}: GetTokenWithQueryCacheFn) => {
  if (!chainId) {
    throw Error('chainId is required')
  }

  if (!address) {
    throw Error('address is required')
  }

  // Try fetching from localStorage
  if (hasToken(`${chainId}:${address}`)) {
    console.log(customTokens)
    const {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      id,
      approved,
    } = customTokens[`${chainId}:${getAddress(address)}`]
    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      approved,
      id,
    } as Data
  }

  if (isTokenListChainId(chainId)) {
    try {
      const [token] = await getTokenList({ chainId, search: address })
      if (token) return token
    } catch {}
  }

  try {
    const resp = await getTokenWeb3(config, {
      address: address as Address,
      chainId,
    })
    const { decimals, address: tokenAddress, symbol, name } = resp

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      approved: false,
      id: `${chainId}:${tokenAddress}`,
    } as Data
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
  const { data: customTokens, hasToken } = useCustomTokens()
  const select = useCallback(
    (data: Data) => getTokenWithQueryCacheHydrate(chainId, data),
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

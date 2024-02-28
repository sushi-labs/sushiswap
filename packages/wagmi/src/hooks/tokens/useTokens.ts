'use client'

import { publicWagmiConfig } from '@sushiswap/wagmi-config'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { createConfig } from '@wagmi/core'
import {
  GetTokenParameters,
  GetTokenReturnType,
  getToken,
} from '@wagmi/core/actions'
import { useMemo } from 'react'
import { ChainId } from 'sushi'
import { Address } from 'viem'

type QueryKeyArgs = { tokens: Partial<GetTokenParameters>[] }
// type QueryKeyConfig = {}

export type FetchTokensArgs = { tokens: GetTokenParameters[] }
export type FetchTokensResult = GetTokenReturnType[]
export type UseTokensArgs = Partial<FetchTokensArgs>
export type UseTokensConfig = Partial<Parameters<typeof useQuery>['2']>

function queryKey({ tokens }: QueryKeyArgs) {
  return [{ entity: 'tokens', tokens: tokens || [] }] as const
}

const queryFn: QueryFunction<
  FetchTokensResult,
  ReturnType<typeof queryKey>
> = ({ queryKey: [{ tokens }] }) => {
  if (!tokens) throw new Error('tokens is required')
  if (tokens.filter((el) => !el.address).length > 0)
    throw new Error('address is required')

  const config = createConfig(publicWagmiConfig)

  return Promise.all(
    tokens.map((token) => {
      return getToken(config, {
        address: token.address as Address,
        chainId: token.chainId as ChainId,
        formatUnits: token.formatUnits,
      })
    }),
  )
}

export function useTokens({
  tokens = [],
  cacheTime,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseTokensArgs & UseTokensConfig) {
  const _enabled = useMemo(() => {
    return Boolean(
      tokens &&
        tokens?.length > 0 &&
        enabled &&
        tokens.map((el) => el.address && el.chainId),
    )
  }, [enabled, tokens])

  return useQuery<
    FetchTokensResult,
    unknown,
    FetchTokensResult,
    ReturnType<typeof queryKey>
  >(queryKey({ tokens }), queryFn, {
    cacheTime,
    enabled: _enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
